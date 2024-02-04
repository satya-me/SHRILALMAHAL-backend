const Router = require('express').Router;
const DashboardController = require('../controllers/Dashboard.controller');

const router = new Router();


router.get('/data', DashboardController.DashboardData);


module.exports = router;
