const Router = require('express').Router;
const PayController = require('../controllers/Payment.controller');

const router = new Router();



router.get('/cashback', PayController.CompositePay);



module.exports = router;
