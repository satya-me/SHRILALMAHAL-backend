const CodeTag = require('../models/Tag');


class QRCodeTag {
    async createTag(tag, count, cashback_lucky_users, cashback_amount) {
        console.log({ tag, count, cashback_lucky_users, cashback_amount });

        const codes = await CodeTag.findOne({ name: tag });
        if (codes) {
            codes.count += Number(count);
            console.log({ codes });
            await codes.save();
        } else {
            await CodeTag.create({ name: tag, count: Number(count), cashback_lucky_users: Number(cashback_lucky_users), cashback_amount: Number(cashback_amount) });
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
