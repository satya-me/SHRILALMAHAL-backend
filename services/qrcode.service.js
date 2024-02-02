const QRCode = require('../models/QRCode');

const ApiError = require('../exceptions/api.exception');

class QRCodeService {
  async getAllCode(tag) {
    const codes = await QRCode.find({ tag: tag, transitions: 0 });
    // console.log({ codes });
    return codes;
  }

  async getAllCodeCount(tag) {
    const codes = await QRCode.find({ tag: tag });
    console.log({ tag });
    return codes;
  }


  async createCode(code) {


    const isAlreadyCode = await QRCode.find({ shortLink: code.shortLink });
    // const isAlreadyCode = await QRCode.find({ shortLink: uniqueId });

    if (isAlreadyCode.length !== 0) {
      throw ApiError.badRequest('This QR code already exists');
    }

    await QRCode.create({ ...code, user: '65ad14c2ec42f44748a4d226' });
  }

  async deleteCode(userId, shortLink) {
    await QRCode.deleteOne({ user: userId, shortLink });
  }
}

module.exports = new QRCodeService();
