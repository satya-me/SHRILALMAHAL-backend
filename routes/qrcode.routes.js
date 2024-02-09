const fs = require('fs');
const path = require('path');
const Router = require('express').Router;

const QRCodeController = require('../controllers/qrcode.controller');
const FetchController = require('../controllers/fetch.controller');
const PDFController = require('../controllers/pdf.controller');

const { VerifyToken } = require('../middlewares/verifyAuth.middleware');

const router = new Router();



// ---------------------------------------------------------------------
router.post('/create', [VerifyToken], QRCodeController.createQRCode);
router.get('/get/:tag?', [VerifyToken], FetchController.getQRCode);
router.get('/tags', [VerifyToken], QRCodeController.getAllTag);
router.get('/test', QRCodeController.test);
router.get('/pdf/:tag_name', [VerifyToken], PDFController.PDF);


router.get('/download/:tag_name', async (req, res) => {
    // Set the file path you want to download
    const filePath = path.join(__dirname, '../', req.params.tag_name); // Change 'filename.ext' to your desired file name
    // console.log(filePath);
    // return;

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }

        // Stream the file to the response
        const fileStream = fs.createReadStream(filePath);
        res.writeHead(200, {
            'Content-Disposition': `attachment; filename=${path.basename(filePath)}`,
            'Content-Type': 'application/octet-stream' // Set the appropriate content type for your file
        });
        fileStream.pipe(res);
    });
});
// ---------------------------------------------------------------------
module.exports = router;
