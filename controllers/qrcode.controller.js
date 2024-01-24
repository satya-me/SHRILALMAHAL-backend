const QRCodeService = require('../services/qrcode.service');
const QRCodeTag = require('../services/qrcode.tag.service');
const QRCodeModel = require('../models/QRCode');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const QRCode = require('qrcode');
const pdf = require('pdfkit');



class QRCodeController {


  async createQRCode(req, res) {
    const tag = req.body.tag;
    const count = req.body.count;
    // console.log(req.body);

    try {
      const saveTag = await QRCodeTag.createTag(tag, count);
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for (let index = 0; index < count; index++) {

        const uniqueId = uuidv4();
        const payload = {
          tag: tag,
          transitions: 0,
          link: process.env.BASE_URL,
          style: {
            bgColor: "#fff",
            patternColor: "#000",
            type: "url",
          },
          logo: {
            src: "images/shri-lal-mahal-logo.png",
          },
          shortLink: uniqueId,
          user: '',
        };
        const code = await QRCodeService.createCode(payload);
        // Send a real-time update to the client
        res.write(`data: Processed ${index + 1} of ${count} QR codes\n\n`);
        // Introduce a delay between iterations (adjust the delay time as needed)
        await new Promise(resolve => setTimeout(resolve, 5));
      }

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
    console.log({
      query: req.query,
      params: req.params,
    });
    const QRS_DATA = await QRCodeModel.find({ tag: tag });
    const QRS_LENGTH = (QRS_DATA.length / Number(pageSize));
    const projectQuery = { tag: tag };
    const skip = (page - 1) * pageSize;
    const QRS = await QRCodeModel.aggregate([
      {
        $match: { tag: tag }  // Use $match to filter by tag
      },
      {
        $skip: skip
      },
      {
        $limit: pageSize
      }
    ]);
    console.log({ QRS: QRS_LENGTH });
    return res.send({ QRS, QRS_LENGTH });
  }

  async getAllTag(req, res) {
    const TAGs = await QRCodeTag.getTags();
    const reversedTAGs = TAGs.reverse();
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
