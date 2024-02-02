const UserModel = require('../models/User');


exports.checkUniqueEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Check if the email is already taken
    const existingEmail = await UserModel.findOne({ email: email });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: "Email is already registered. Please use a different email.", key: "email" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something Went Wrong. Please Try Again Later", error: err.message });
  }
};


exports.loginEmptyFieldCheck = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email) {
      return res.status(404).json({ success: false, message: "Email ID is required.", key: "email" });
    }

    if (!password) {
      return res.status(404).json({ success: false, message: "Password is required.", key: "password" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something Went Wrong. Please Try Again Later", error: err.message });
  }
};


exports.signUpEmptyFieldCheck = async (req, res, next) => {
  const { email, password, full_name } = req.body;

  try {
    if (!full_name) {
      return res.status(404).json({ success: false, message: "Name is required.", key: "full_name" });
    }
    if (!email) {
      return res.status(404).json({ success: false, message: "Email ID is required.", key: "email" });
    }
    if (!password) {
      return res.status(404).json({ success: false, message: "Password is required.", key: "password" });
    } else if (password.length <= 4) {
      return res.status(404).json({ success: false, message: "Password should be minimum 5 characters long.", key: "password" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Something Went Wrong. Please Try Again Later", error: err.message });
  }
};






// const tokenService = require('../services/token.service');

// const ApiError = require('../exceptions/api.exception');

// module.exports = (req, res, next) => {
//   try {
//     const authorizationHeader = req.headers.authorization;

//     if (!authorizationHeader) {
//       return next(ApiError.unauthorizedError());
//     }

//     const accessToken = authorizationHeader.split(' ')[1];

//     if (!accessToken) {
//       return next(ApiError.unauthorizedError());
//     }

//     const userData = tokenService.validateAccessToken(accessToken);

//     if (!userData) {
//       return next(ApiError.unauthorizedError());
//     }

//     req.user = userData;
//     next();
//   } catch (e) {
//     return next(ApiError.unauthorizedError());
//   }
// };
