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
    console.log({ tag, count, cashback_lucky_users, cashback_amount });

    try {
      if (Number(count) <= Number(cashback_lucky_users)) {
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
