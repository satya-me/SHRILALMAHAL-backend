// testController.js
const QRCodeTag = require('../services/qrcode.tag.service');
const QRCodeService = require('../services/qrcode.service');
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

// exports.createQRCode = async (req, res) => {

//     try {
//         // Run the background task without waiting for it to finish
//         const tag = 'BADAL';
//         const count = 20;
//         exports.runBackgroundTask(tag, count);

//         // Immediately respond to the client
//         res.status(200).json({ message: 'QR code generation started in the background.' });
//     } catch (e) {
//         return res.status(500).json({ error: e.message });
//     }
// }


exports.QRCode = async (req, res) => {
    console.log({ message: "Calling __MAIN__ => QRCode api." });
    const payload = req.body
    console.log({payload});
    await QRCodeService.createCode(payload);
}