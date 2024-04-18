const { body } = require('express-validator');

exports.ProductValidate = () => {
  return [
    body('name', 'Tên sản phẩm không thể để trống!').notEmpty(),
    body('price', 'Giá phải là giá trị số hợp lệ').isNumeric(),
    body('stockQuantity', 'Số lượng phải là giá trị số hợp lệ').isNumeric(),
    body('categoryID', 'Category ID phải là MongoDB ID hợp lệ').optional().isMongoId()
  ];
};
