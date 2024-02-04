const Router = require('express').Router;
const ReportController = require('../controllers/Report.controller');

const router = new Router();


router.get('/data', ReportController.ReportData);
router.get('/download-excel', ReportController.DownloadExcel);


module.exports = router;
