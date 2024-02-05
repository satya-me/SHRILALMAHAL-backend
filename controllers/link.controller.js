const linkService = require('../services/link.service');

const ApiError = require('../exceptions/api.exception');
const QRCode = require('../models/QRCode');


class LinkController {
  async redirectLink(req, res, next) {
    try {
      // return console.log({ message: 'Page Expired!' });
      const { type, data } = await linkService.redirectTo(req.params.link);
      console.log({ data });
      if (!data) {
        return res.send('Link not found');
      }
      if (data == '/expired') {
        return res.redirect(data);
      }
      // return console.log({ data });
      if (type.toLowerCase() === 'url') {
        const URL = `${data.link}/sl/${data.shortLink}`;
        const SUBMIT_URL = `${data.link}/sl/sm/${data.shortLink}`;
        // return console.log({ data, URL });
        // return a form view 
        return res.render('index', { pageTitle: 'My EJS App', shortLink: data.shortLink, url: SUBMIT_URL });


      } else {
        return res.json({ type, data });
      }
    } catch (e) {
      console.log(e);
      return res.send(e.message);
    }
  }

  async submitForm(req, res) {
    const body = req.body;
    // console.log(body);
    // return;

    const QRData = await linkService.QRData(body);
    // return console.log({ QRData });
    if (QRData.flag === 1) {
      return res.send({ data: QRData });
    }
    return res.send({ data: QRData });
  }

  async Cashback(req, res) {
    const { mode, upi, bank, uuid } = req.body;



    const code = await QRCode.findOne({ shortLink: uuid });
    if (code.is_lucky_users) {
      const TagDetails = await Tag.findOne({ name: code.tag });
      const payload = {
        amount: TagDetails.cashback_amount,
        mode: modeOfPayment,
        upi_id: upi,
        full_name: code.data.full_name,
        mobile_number: code.data.mobile_number,
        uuid: uuid,
      }
      console.log({ payload });
      // const result = await paymentController.UPIPay(payload);

      // code.payment_resp = result;
      // await code.save();
      return { type: code.style.type, data: 'thankyou', flag: true, result: result.data };
    }
    console.log({ mode, upi, bank, uuid });
    res.send({ mode, upi, bank, uuid });
  }

}




module.exports = new LinkController();
