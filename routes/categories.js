const express = require('express');
const router = express.Router();
const CategoryModel = require('../schemas/category');
const ResHelper = require('../helper/ResponseHandle');
const Validator = require('../validators/category');
const { validationResult } = require('express-validator');

router.get('/', async function (req, res, next) {
  try {
    const categories = await CategoryModel.find();
    ResHelper.ResponseSend(res, true, 200, categories);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      ResHelper.ResponseSend(res, false, 404, "Không tìm thấy category");
      return;
    }
    ResHelper.ResponseSend(res, true, 200, category);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

router.post('/', Validator.CategoryValidate(), async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newCategory = new CategoryModel({
      name: req.body.name,
      description: req.body.description
    });
    await newCategory.save();
    ResHelper.ResponseSend(res, true, 201, newCategory);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

router.put('/:id', Validator.CategoryValidate(), async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const category = await CategoryModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description
    }, { new: true });
    if (!category) {
      ResHelper.ResponseSend(res, false, 404, "Không tìm thấy category");
      return;
    }
    ResHelper.ResponseSend(res, true, 200, category);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      ResHelper.ResponseSend(res, false, 404, "Không tìm thấy category");
      return;
    }
    ResHelper.ResponseSend(res, true, 200, "Đã xóa category");
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

module.exports = router;
