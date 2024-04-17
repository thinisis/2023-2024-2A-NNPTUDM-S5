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

router.post('/forgotPassword', async function (req, res, next) {
  const username = req.body.username;

  if (!username) {
    ResHelper.ResponseSend(res, false, 400, "Tên tài khoản không thể để trống!");
    return;
  }

  try {
    const user = await userModel.findOne({ username });

    if (!user) {
      ResHelper.ResponseSend(res, false, 404, "Tên tài khoản không tồn tại!");
      return;
    }

    const token = user.genTokenResetPassword();
    await user.save();

    const url = siteUrl + '/resetPassword.html?token=' + token;

    await sendmail(user.email, url);

    ResHelper.ResponseSend(res, true, 200, "Đã gửi email vào hộp thư đăng ký!");
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message || "Lỗi máy chủ nội bộ");
  }
});

router.post('/resetPassword/:token', Validator.PasswordValidate(), async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let user = await userModel.findOne({
    ResetPasswordToken: req.params.token
  });
  if (!user) {
    ResHelper.ResponseSend(res, false, 404, "Liên kết đã hết hạn. Vui lòng thực hiện lại!");
    return;
  }
  if (user.ResetPasswordExp > Date.now()) {
    user.password = req.body.password;
  }
  user.ResetPasswordExp = undefined;
  user.ResetPasswordToken = undefined;
  await user.save();
  ResHelper.ResponseSend(res, true, 200, "Đã thay đổi mật khẩu thành công!");
});

router.post('/logout', async function (req, res, next) {
  res.clearCookie('token').send(ResHelper.ResponseSend(res, true, 200, "Bạn đã đăng xuất"));
});

router.post('/login', async function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    ResHelper.ResponseSend(res, false, 401, 'Tên tài khoản và mật khẩu không được để trống');
    return;
  }
  let user = await userModel.findOne({ username: username });
  if (!user) {
    ResHelper.ResponseSend(res, false, 401, 'Tên tài khoản hoặc mật khẩu không đúng');
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
    ResHelper.ResponseSend(res, false, 404, 'Tên tài khoản hoặc mật khẩu không đúng');
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
      name:req.body.name,
      avatarUrl: "default",
      address:"",
      phone:"",
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
    ResHelper.ResponseSend(res, false, 404, "Bạn chưa đăng nhập");
    return;
  }

  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      ResHelper.ResponseSend(res, false, 404, "Người dùng không tồn tại");
      return;
    }
    user.password = req.body.password;
    await user.save();

    ResHelper.ResponseSend(res, true, 200, "Đổi mật khẩu thành công");
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error);
  }
});

module.exports = router;
