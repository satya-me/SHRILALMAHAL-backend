const linkService = require('../services/link.service');

const ApiError = require('../exceptions/api.exception');

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
    const QRData = await linkService.QRData(body);
    if (QRData.flag === 1) {
      return res.render('thank-you');
      return res.send({ message: 'Thank you.' });
    }
    return res.redirect(QRData.data);
  }
}

module.exports = new LinkController();
