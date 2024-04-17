const express = require('express');
const router = express.Router();
const ProductModel = require('../schemas/product');
const ResHelper = require('../helper/ResponseHandle');
const Validator = require('../validators/product');
const { validationResult } = require('express-validator');
const protect = require('../middleware/protect');

router.use(protect);

router.get('/', async function (req, res, next) {
  try {
    const products = await ProductModel.find();
    ResHelper.ResponseSend(res, true, 200, products);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      ResHelper.ResponseSend(res, false, 404, "Product not found");
      return;
    }
    ResHelper.ResponseSend(res, true, 200, product);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

router.post('/', Validator.ProductValidate(), async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newProduct = new ProductModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stockQuantity: req.body.stockQuantity,
      imageURL: req.body.imageURL,
      categoryID: req.body.categoryID
    });
    await newProduct.save();
    ResHelper.ResponseSend(res, true, 201, newProduct);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

router.put('/:id', Validator.ProductValidate(), async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await ProductModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stockQuantity: req.body.stockQuantity,
      imageURL: req.body.imageURL,
      categoryID: req.body.categoryID
    }, { new: true });
    if (!product) {
      ResHelper.ResponseSend(res, false, 404, "Product not found");
      return;
    }
    ResHelper.ResponseSend(res, true, 200, product);
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      ResHelper.ResponseSend(res, false, 404, "Product not found");
      return;
    }
    ResHelper.ResponseSend(res, true, 200, "Product deleted successfully");
  } catch (error) {
    ResHelper.ResponseSend(res, false, 500, error.message);
  }
});

module.exports = router;
