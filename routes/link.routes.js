const Router = require('express').Router;
const LinkController = require('../controllers/link.controller');

const router = new Router();



router.get('/:link', LinkController.redirectLink);
router.post('/sm/:uuid', LinkController.submitForm);
router.post('/sm/cashback/form', LinkController.Cashback);



module.exports = router;
