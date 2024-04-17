const { body } = require('express-validator');

exports.CategoryValidate = () => {
  return [
    body('name', 'Name is required').notEmpty(),
    body('description', 'Description must be a string').optional().isString()
  ];
};
