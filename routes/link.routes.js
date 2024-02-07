const Router = require('express').Router;
const LinkController = require('../controllers/link.controller');
const { CheckUUID } = require('../middlewares/checkUUID.middleware');

const router = new Router();



router.get('/:link', LinkController.redirectLink);
router.post('/sm/:uuid', [CheckUUID], LinkController.submitForm);
router.post('/sm/cashback/form', [CheckUUID], LinkController.Cashback);



module.exports = router;
