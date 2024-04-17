const express = require('express');
const router = express.Router();
const CategoryModel = require('../schemas/category');
const ResHelper = require('../helper/ResponseHandle');
const Validator = require('../validators/category');
const { validationResult } = require('express-validator');

// GET all categories
router.get('/', async function (req, res, next) {
  try {
    const categories = await CategoryModel.find();
    ResHelper.ResponseSend(res, true, 200, categories);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

// GET a single category by ID
router.get('/:id', async function (req, res, next) {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      ResHelper.ResponseSend(res, false, 404, "Category not found");
      return;
    }
    ResHelper.ResponseSend(res, true, 200, category);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

// Create a new category
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

// Update a category by ID
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
      ResHelper.ResponseSend(res, false, 404, "Category not found");
      return;
    }
    ResHelper.ResponseSend(res, true, 200, category);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

// Delete a category by ID
router.delete('/:id', async function (req, res, next) {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      ResHelper.ResponseSend(res, false, 404, "Category not found");
      return;
    }
    ResHelper.ResponseSend(res, true, 200, "Category deleted successfully");
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

module.exports = router;
