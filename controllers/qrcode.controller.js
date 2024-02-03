const QRCodeService = require('../services/qrcode.service');
const QRCodeTag = require('../services/qrcode.tag.service');
const QRCodeModel = require('../models/QRCode');
const TagModel = require('../models/Tag');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const QRCode = require('qrcode');
const pdf = require('pdfkit');
const { runBackgroundTask } = require('./BGController');
const { manualTask } = require('../job/manualWork');


class QRCodeController {


  async createQRCode(req, res) {
    const { tag, count, cashback_lucky_users, cashback_amount } = req.body;
    

    try {
      if (count <= cashback_lucky_users) {
        return res.status(401).json({ message: 'Lucky user number must be less then QR count.' });
      }

      const saveTag = await QRCodeTag.createTag(tag, count, cashback_lucky_users, cashback_amount);
      const tagCount = await TagModel.findOne({ name: tag });

      // return console.log(tagCount.count);

      console.log({ message: 'QR code generation started in the background.' });
      console.log({ tag, count, tagCount: tagCount.count });
      runBackgroundTask(tag, count, tagCount.count, cashback_lucky_users, cashback_amount);
      // Immediately respond to the client
      return res.status(200).json({ message: 'QR code generation started in the background.' });


      // End the response outside the loop
      res.end("Done");
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  async getQRCode(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; // Set your preferred page size
    const tag = req.params.tag;


    // Use countDocuments directly
    const TAG_DATA = await TagModel.findOne({ name: tag });
    const TAG_DATA_COUNT = TAG_DATA?.count;
    // console.log(TAG_DATA_COUNT.count);

    // No need to use lean() if not using QRS_DATA elsewhere
    const QRS_RESULT = await QRCodeModel.aggregate([
      {
        $facet: {
          metadata: [
            { $match: { tag: tag } },
            { $group: { _id: null, total: { $sum: 1 } } },
            { $project: { _id: 0, total: 1 } },
          ],
          data: [
            { $match: { tag: tag } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
          ],
        },
      },
    ]).allowDiskUse(true).exec();

    const QRS_LENGTH = QRS_RESULT[0]?.metadata[0]?.total || 0;
    const QRS = QRS_RESULT[0]?.data || [];

    var _QR = await QRCodeModel.find({ tag });
    var _Tag = await TagModel.findOne({ name: tag });
    const lastRecord = _QR[_QR.length - 1];
    const recordCount = _QR.length;
    if (lastRecord) {
      const currentDate = new Date();

      const createdAtDate = new Date(lastRecord.createdAt);

      const timeDifference = currentDate - createdAtDate;

      const secondsDifference = Math.floor(timeDifference / 1000);
      var _FLAG = {};
      if (secondsDifference > 5 && recordCount < _Tag.count) {

        _FLAG = {
          is_bg: true,
          massage: "Need to call BG"
        }
        var restOf = _Tag.count - recordCount;
        runBackgroundTask(tag, restOf, TAG_DATA.cashback_lucky_users, TAG_DATA.cashback_amount);
      } else {
        _FLAG = {
          is_bg: false,
          massage: "No need to call BG"
        }
      }
      console.log({ _FLAG });
    } else {
      runBackgroundTask(tag, _Tag.count, TAG_DATA.cashback_lucky_users, TAG_DATA.cashback_amount);
    }

    // console.log({ QRS, QRS_LENGTH, TOTAL_QRS_LENGTH: QRS_LENGTH, TAG_DATA_COUNT });

    return res.send({ QRS, QRS_LENGTH, TOTAL_QRS_LENGTH: QRS_LENGTH, TAG_DATA_COUNT, _FLAG });
  }

  async getAllTag(req, res) {
    const TAGs = await QRCodeTag.getTags();
    const reversedTAGs = TAGs.reverse();
    // console.log({ reversedTAGs });
    // const result = await QRCodeModel.deleteMany({ tag: 'TAG12K' });
    return res.send(reversedTAGs);
  }

  async test(req, res) {


    // Data to be encoded in the QR code
    const dataToEncode = 'https://www.example.com';

    // Generate QR code
    QRCode.toFile('output2.png', dataToEncode, (err) => {
      if (err) throw err;
      console.log(`QR code generated and saved as ${'output.png'}`);
    });

  }




  async deleteQRCode(req, res, next) {
    try {
      const code = await QRCodeService.deleteCode(
        req.user.id,
        req.params.shortLink,
      );

      return res.json(code);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new QRCodeController();
