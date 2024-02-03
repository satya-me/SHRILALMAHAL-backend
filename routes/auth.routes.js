const express = require('express');
const UserController = require('../controllers/user.controller');
const { checkUniqueEmail, loginEmptyFieldCheck, signUpEmptyFieldCheck } = require('../middlewares/auth.middleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const resendEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 2,
  message: 'Отправлено слишком много запросов',
  standardHeaders: true,
  legacyHeaders: false,
});


/******* OUR ROUTES *******/
router.post('/admin/login', [loginEmptyFieldCheck], UserController.Login);
router.post('/admin/registration', [signUpEmptyFieldCheck, checkUniqueEmail], UserController.Registration);


module.exports = router;



// const userController = require('../controllers/user.controller');

// const {
//   userAuthValidationRules,
//   validate,
// } = require('../middlewares/validate.middleware.js');
// const authMiddleware = require('../middlewares/auth.middleware.js');

// const router = new Router();


// router.post(
//   '/registration',
//   userAuthValidationRules(),
//   validate,
//   userController.registration,
// );

// router.post(
//   '/login',
//   userAuthValidationRules(),
//   validate,
//   userController.login,
// );

// router.post('/logout', userController.logout);

// router.get('/activate/:link', userController.activate);

// router.post(
//   '/resend',
//   resendEmailLimiter,
//   authMiddleware,
//   userController.resendMailConfirmation,
// );

// router.post('/refresh', userController.refresh);


