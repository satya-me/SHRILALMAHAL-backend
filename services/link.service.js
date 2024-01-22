const QRCode = require('../models/QRCode');

class LinkService {
  async redirectTo(shortLink) {

    const code = await QRCode.findOne({ shortLink });
    if (code) {

      if (code.transitions >= 1) {
        return { type: code.style.type, data: '/expired' };
      }
      return { type: code.style.type, data: code };
    }

    return { type: 'false', data: '/expired' };;
  }

  async QRData(data) {
    const code = await QRCode.findOne({ shortLink: data.uuid });
    // return console.log({ data });
    if (code.transitions >= 1) {
      return { type: code.style.type, data: '/expired' };
    }
    if (code) {
      code.transitions++;
      code.data = data;
      await code.save();
      // return console.log(code);
      return { type: code.style.type, data: code.link, flag: 1 };
    }

    return null;
  }
}

module.exports = new LinkService();
