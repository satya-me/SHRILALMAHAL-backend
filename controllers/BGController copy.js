const QRCodeTag = require('../services/qrcode.tag.service');
const QRCodeService = require('../services/qrcode.service');
const TagModal = require('../models/Tag');
const path = require('path');
const { Worker } = require('worker_threads');

exports.runBackgroundTask = async (tag, count) => {
    // await QRCodeTag.createTag(tag, count);
    console.log({ message: 'runBackgroundTask' });
    return new Promise((resolve, reject) => {
        const workerScriptPath = path.join(__dirname, '..', 'job', 'worker.js');
        const worker = new Worker(workerScriptPath, { workerData: { tag, count } });

        worker.on('message', (message) => {
            console.log({ message });
        });

        worker.on('error', (error) => {
            reject(error);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            } else {
                resolve();
            }
        });
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