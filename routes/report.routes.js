const Router = require('express').Router;
const ReportController = require('../controllers/Report.controller');
const { VerifyToken } = require('../middlewares/verifyAuth.middleware');

const router = new Router();


router.get('/data', [VerifyToken], ReportController.ReportData);
router.get('/user/data', ReportController.UserReportData);
router.get('/download-excel', [VerifyToken], ReportController.DownloadExcel);


module.exports = router;
