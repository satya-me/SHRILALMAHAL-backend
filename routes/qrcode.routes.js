const Router = require('express').Router;

const QRCodeController = require('../controllers/qrcode.controller');
const FetchController = require('../controllers/fetch.controller');
const PDFController = require('../controllers/pdf.controller');

const { VerifyToken } = require('../middlewares/verifyAuth.middleware');

const router = new Router();



// ---------------------------------------------------------------------
router.post('/create', [VerifyToken], QRCodeController.createQRCode);
router.get('/get/:tag?', FetchController.getQRCode);
router.get('/tags', [VerifyToken], QRCodeController.getAllTag);
router.get('/test', QRCodeController.test);
router.get('/pdf/:tag_name', [VerifyToken], PDFController.PDF);
// router.get('/pdf2/:tag_name', PDFController.PDF6);
// ---------------------------------------------------------------------
module.exports = router;
