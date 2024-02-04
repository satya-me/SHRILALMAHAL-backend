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
      if (code.is_lucky_users) {
        const TagDetails = await Tag.findOne({ name: code.tag });
        const payload = {
          amount: TagDetails.cashback_amount,
          upi_id: data.upi_id,
          full_name: data.full_name,
          mobile_number: data.mobile_number,
          uuid: data.uuid,
        }
        const result = await paymentController.UPIPay(payload);
     
        code.payment_resp = result;
        await code.save();
        return { type: code.style.type, data: 'thankyou', flag: true, result: result.data };
      }
      return { type: code.style.type, data: 'thankyou', flag: true };
    }

    return null;
  }
}

module.exports = new LinkService();
