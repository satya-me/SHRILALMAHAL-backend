const CodeTag = require('../models/Tag');


class QRCodeTag {
    async createTag(tag, count) {

        const codes = await CodeTag.findOne({ name: tag });
        if (codes) {
            codes.count += count;
            await codes.save();
        } else {
            await CodeTag.create({ name: tag, count: count });
        }

        return codes;
    }

    async getTags() {
        const codes = await CodeTag.find({});
        // console.log({ codes });
        return codes;
    }

}

module.exports = new QRCodeTag();
