const Router = require('express').Router;
const LinkController = require('../controllers/link.controller');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = new Router();


// router.get('/:satya', createProxyMiddleware({
//     target: 'https://www.nafed-india.com',
//     changeOrigin: true,
//     pathRewrite: (path, req) => {
//         // Include the parameter in the path
//         const newPath = '/' + req.params.satya;
//         return newPath;
//     },
// }));

router.get('/:link', LinkController.redirectLink);
router.post('/sm/:uuid', LinkController.submitForm);



module.exports = router;
