const QRCode = require('../models/QRCode');
const Tag = require('../models/Tag');
const paymentController = require('../controllers/Payment.controller');
class LinkService {
  async redirectTo(shortLink) {

    const code = await QRCode.findOne({ shortLink });
    if (code) {

      if (code.transitions >= 1) {
        return { type: code.style.type, data: '/expired' };
      }
      return { type: code.style.type, data: code };
    }

    return { type: 'false', data: '/expired' };
  }

  async QRData(data) {

    const code = await QRCode.findOne({ shortLink: data.uuid });
    if (code.transitions >= 1) {
      return { type: code.style.type, data: 'expired', flag: false };
    }
    if (code) {
      code.transitions++;
      code.data = data;
      await code.save();
      return { type: code.style.type, data: 'thankyou', flag: true, uuid: data.uuid, is_lucky: code.is_lucky_users };
    }

    return null;
  }
}

module.exports = new LinkService();
