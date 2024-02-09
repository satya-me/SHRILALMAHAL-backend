const UserModel = require('../models/User');
const bcryptjs = require('bcryptjs');
const CreateToken = require('../util/CreateToken');
const SecurePassword = require('../util/SecurePassword');
// const userService = require('../services/user.service');


// Registration controller
exports.Registration = async (req, res, next) => {
  const { email, password, full_name } = req.body;
  try {
    const setPassword = await SecurePassword(password);
    const NewUser = new UserModel({
      full_name,
      email,
      password: setPassword,
    });

    const userData = await NewUser.save();
    const tokenData = CreateToken(userData._id);
    return res.status(200).json({ success: true, message: "Registered Successfully", data: userData, token: tokenData });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// Login controller
exports.Login = async (req, res) => {
  const { email, password, rememberme } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email: email });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User Not Found. Please Signup & Continue.", key: "email" });
    } else {
      const USERDATA = {
        id: existingUser._id,
        full_name: existingUser.full_name,
        email: existingUser.email,
        rememberme,
      };
      if (existingUser && (bcryptjs.compareSync(password, existingUser.password))) {
        const tokenData = CreateToken(existingUser);
        // console.log({existingUser});
        return res.status(200).json({ success: true, message: "Login Successfully", data: USERDATA, token: tokenData });
      } else {
        if (!(bcryptjs.compareSync(password, existingUser.password))) {
          return res.status(400).json({ success: false, message: "Invalid Password. Please try again", key: "password" })
        }
      }
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// exports.logout = async (req, res, next) => {
//   try {
//     const { refreshToken } = req.cookies;
//     const token = await userService.logout(refreshToken);

//     res.clearCookie('refreshToken');
//     req.user = {};

//     return res.json(token);
//   } catch (e) {
//     next(e);
//   }
// };

// exports.refresh = async (req, res, next) => {
//   try {
//     const { refreshToken } = req.cookies;
//     const userData = await userService.refresh(refreshToken);

//     res.cookie('refreshToken', userData.refreshToken, {
//       maxAge: 900000,
//       httpOnly: true,
//     });

//     return res.json(userData);
//   } catch (e) {
//     next(e);
//   }
// };

// exports.activate = async (req, res, next) => {
//   console.log(13132);
//   try {
//     const activationLink = req.params.link;
//     await userService.activate(activationLink);

//     return res.redirect(`${process.env.CLIENT_URL}/codes?confirm=email`);
//   } catch (e) {
//     next(e);
//   }
// };

// exports.resendMailConfirmation = async (req, res, next) => {
//   try {
//     const email = req.user.email;

//     const activateEmail = await userService.resendMailConfirmation(email);

//     return res.json(activateEmail);
//   } catch (e) {
//     next(e);
//   }
// };

