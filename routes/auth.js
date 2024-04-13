const express = require('express');
const router = express.Router();
const userModel = require('../schemas/user');
const ResHelper = require('../helper/ResponseHandle');
const Validator = require('../validators/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const protect = require('../middleware/protect');
const sendmail = require('../helper/sendmail');
require('dotenv').config();
const siteUrl = process.env.WEBSITE_URL;



router.get('/me', protect, async function (req, res, next) {
  ResHelper.ResponseSend(res, true, 200, req.user);
});

router.post('/ForgotPassword', Validator.EmailValidate(), async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  let user = await userModel.findOne({
    email: req.body.email
  });
  if (!user) {
    ResHelper.ResponseSend(res, false, 404, "Email khong ton tai");
    return;
  }
  let token = user.genTokenResetPassword();
  await user.save();
  let url = 'http://'+siteUrl+'/resetPassword.html?token='+token;
  try {
    await sendmail(user.email, url);
    ResHelper.ResponseSend(res, true, 200, "Email duoc gui thanh cong");
  } catch (error) {
    ResHelper.ResponseSend(res, false, 404, error);
  }
});

router.post('/ResetPassword/:token', Validator.PasswordValidate(), async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let user = await userModel.findOne({
    ResetPasswordToken: req.params.token
  });
  if (!user) {
    ResHelper.ResponseSend(res, false, 404, "URL khong dung");
    return;
  }
  if (user.ResetPasswordExp > Date.now()) {
    user.password = req.body.password;
  }
  user.ResetPasswordExp = undefined;
  user.ResetPasswordToken = undefined;
  await user.save();
  ResHelper.ResponseSend(res, true, 200, "Doi password thanh cong");
});

router.post('/logout', async function (req, res, next) {
  res.clearCookie('token').send(ResHelper.ResponseSend(res, true, 200, "Ban da dang xuat"));
});

router.post('/login', async function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    ResHelper.ResponseSend(res, false, 401, 'username va password phai dien day du');
    return;
  }
  let user = await userModel.findOne({ username: username });
  if (!user) {
    ResHelper.ResponseSend(res, false, 401, 'username hoac password khong dung');
    return;
  }
  var checkpass = bcrypt.compareSync(password, user.password);
  if (checkpass) {
    res.status(200).cookie('token', user.getJWT(), {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true
    }).send({
      success: true,
      data: user.getJWT()
    });
  } else {
    ResHelper.ResponseSend(res, false, 404, 'username hoac password khong dung');
  }
});

router.post('/register', Validator.UserValidate(), async function (req, res, next) {
  var errors = validationResult(req).errors;
  if (errors.length > 0) {
    ResHelper.ResponseSend(res, false, 404, errors);
    return;
  }
  try {
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      avatar: "default",
      role: ['USER']
    });
    await newUser.save();
    ResHelper.ResponseSend(res, true, 200, newUser);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 404, error);
  }
});

router.post('/changePassword', protect, Validator.PasswordValidate(), async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  if (!req.user) {
    ResHelper.ResponseSend(res, false, 404, "Ban chua dang nhap");
    return;
  }

  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      ResHelper.ResponseSend(res, false, 404, "Nguoi dung khong ton tai");
      return;
    }
    user.password = req.body.password;
    await user.save();

    ResHelper.ResponseSend(res, true, 200, "Doi mat khau thanh cong");
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error);
  }
});



module.exports = router;
