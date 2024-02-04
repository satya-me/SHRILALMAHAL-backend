const QRCode = require('../models/QRCode');
const { UPIPay } = require('../controllers/Payment.controller');

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
   
    // return console.log(data);
    const code = await QRCode.findOne({ shortLink: data.uuid });
    if (code.transitions >= 1) {
      return { type: code.style.type, data: 'expired', flag: false };
    }
    if (code) {
      // code.transitions++;
      // code.data = data;
      // await code.save();
      if (code.is_lucky_users) {
        
        // code.payment_resp
        // code.data = result;
        // await code.save();
        return { type: code.style.type, data: 'thankyou', flag: true, result: result.data };
      }
      return { type: code.style.type, data: 'thankyou', flag: true };
    }

    return null;
  }
}

module.exports = new LinkService();
