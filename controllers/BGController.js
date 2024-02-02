const QRCodeService = require('../services/qrcode.service');
const QRCodeModal = require('../models/QRCode');
const TagModal = require('../models/Tag');
const { v4: uuidv4 } = require('uuid');

exports.runBackgroundTask = async (tag, count, acTagCount) => {
    console.log({ message: 'runBackgroundTask' });
    return new Promise(async (resolve, reject) => {
        const savePromises = [];

        for (let i = 0; i < count; i++) {
            const uniqueId = uuidv4();
            const payload = {
                transitions: 0,
                data: null,
                tag,
                link: process.env.DOMAIN,
                style: {
                    bgColor: "#fff",
                    patternColor: "#000",
                    type: "url",
                },
                logo: {
                    src: "images/shri-lal-mahal-logo.png",
                },
                shortLink: uniqueId,
                user: '65ad14c2ec42f44748a4d226',
            };

            try {
                const qrCount = await QRCodeModal.countDocuments({ tag: tag });
                // if qr count is less then tag count => insert
                console.log({ qrCount, acTagCount });
                if (qrCount < acTagCount) {
                    console.log({ uniqueId });
                    console.log(`Number of documents where tag is 'Tag': ${qrCount}`);
                    const tt = new QRCodeModal(payload);
                    tt.save()
                    // savePromises.push(tt.save());
                } else {
                    console.log(`Number of documents where tag is 'Tag': ${qrCount} but actual count is ${acTagCount}`);
                    break;
                }
            } catch (error) {
                console.error("Error creating QRCodeModal:", error);
            }
        }
        // console.log({savePromises});
        // try {
        //     await Promise.all(savePromises);
        //     resolve();
        // } catch (error) {
        //     reject(error);
        // }
        try {
            await Promise.all(savePromises);
            console.log("All QRCodeModals saved successfully.");
        } catch (error) {
            console.error("Error saving QRCodeModals:", error);
            throw error;
        }
    });
}


exports.QRCode = async (req, res) => {
    // console.log({ message: "Calling __MAIN__ => QRCode api." });
    const payload = req.body
    var _QR = await QRCodeService.getAllCodeCount(payload.tag);
    var _Tag = await TagModal.findOne({ name: payload.tag });
    // console.log({ __TagC: _Tag.count, __QRC: _QR.length});
    if (_Tag.count == _QR.length) {
        console.table({ __TagC: _Tag.count, __QRC: _QR.length, skip: true });
    } else {
        console.table({ __TagC: _Tag.count, __QRC: _QR.length, skip: false });
        await QRCodeService.createCode(payload);
    }

}


