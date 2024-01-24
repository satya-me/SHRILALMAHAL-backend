const Router = require('express').Router;

const BGController = require('../controllers/testController');

const router = new Router();

// router.get('/worker', BGController.createQRCode);
router.post('/qr/store', BGController.QRCode);


module.exports = router;
