const { body } = require('express-validator');

exports.CategoryValidate = () => {
  return [
    body('name', 'Vui lòng nhập tên category').notEmpty(),
    body('description', 'Mô tả phải là một chuỗi kí tự').optional().isString()
  ];
};
