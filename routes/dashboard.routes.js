const Router = require('express').Router;
const DashboardController = require('../controllers/Dashboard.controller');
const { VerifyToken } = require('../middlewares/verifyAuth.middleware');

const router = new Router();


router.get('/data', [VerifyToken], DashboardController.DashboardData);


module.exports = router;
