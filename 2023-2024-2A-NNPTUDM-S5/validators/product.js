const { body } = require('express-validator');

exports.ProductValidate = () => {
  return [
    body('name', 'Name is required').notEmpty(),
    body('price', 'Price must be a valid number').isNumeric(),
    body('stockQuantity', 'Stock quantity must be a valid number').isNumeric(),
    body('categoryID', 'Category ID must be a valid MongoDB ObjectId').optional().isMongoId()
  ];
};
