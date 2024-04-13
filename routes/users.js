var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var ResHelper = require('../helper/ResponseHandle');
var Validator = require('../validators/user');
const { validationResult } = require('express-validator');
const protect = require('../middleware/protect');
const checkRole = require('../middleware/checkRole');



router.use(protect);

router.get('/', checkRole("admin"), async function (req, res, next) {
  try {
    let users = await userModel.find({}).exec();
    ResHelper.ResponseSend(res, true, 200, users)
  } catch (error) {
    ResHelper.ResponseSend(res, false, 403, error.message);
  }
});

router.get('/:username', checkRole('admin','user'), async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.params.username });
    if (!user) {
      return ResHelper.ResponseSend(res, false, 404, "User not found");
    }
    ResHelper.ResponseSend(res, true, 200, user);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 403, error.message);
  }
});

router.put('/:username', checkRole('admin'), async (req, res) => {
  try {
    const updatedUser = await userModel.findOneAndUpdate({ username: req.params.username }, req.body, { new: true });
    if (!updatedUser) {
      return ResHelper.ResponseSend(res, false, 404, "User not found");
    }
    ResHelper.ResponseSend(res, true, 200, updatedUser);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 403, error.message);
  }
});

router.delete('/:username', checkRole('admin'), async (req, res) => {
  try {
    const deletedUser = await userModel.findOneAndDelete({ username: req.params.username });
    if (!deletedUser) {
      return ResHelper.ResponseSend(res, false, 404, "User not found");
    }
    ResHelper.ResponseSend(res, true, 200, "User deleted successfully");
  } catch (error) {
    ResHelper.ResponseSend(res, false, 403, error.message);
  }
});




module.exports = router;
