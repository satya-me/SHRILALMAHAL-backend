const Router = require('express').Router;

const QRCodeController = require('../controllers/qrcode.controller');
const PDFController = require('../controllers/pdf.controller');

const router = new Router();



// ---------------------------------------------------------------------
router.post('/create', QRCodeController.createQRCode);
router.get('/get/:tag?', QRCodeController.getQRCode);
router.get('/tags', QRCodeController.getAllTag);
router.get('/test', QRCodeController.test);
router.get('/tt', PDFController.tt);
router.get('/pdf/:tag_name', PDFController.PDF);
// ---------------------------------------------------------------------
module.exports = router;
