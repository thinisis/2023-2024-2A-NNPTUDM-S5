const express = require('express');
const protect = require('../middleware/protect');
const checkRole = require('../middleware/checkRole');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const ResHelper = require('../helper/ResponseHandle');

router.use(protect);

async function getCategories() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/categories/');
        const responseData = await response.json();

        if (!responseData.success) {
            throw new Error('API request was not successful');
        }

        return responseData;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

router.use(function(req, res, next) {
    const headerContent = fs.readFileSync('views/admin/header.ejs', 'utf8');
    res.locals.header = headerContent;
    next();
});

router.use(function(req, res, next) {
    const modalContent = fs.readFileSync('views/admin/modal.ejs', 'utf8');
    res.locals.modal = modalContent;
    next();
});

router.use(function(req, res, next) {
    const sidebarContent = fs.readFileSync('views/admin/sidebar.ejs', 'utf8');
    res.locals.sidebar = sidebarContent;
    next();
});

router.get('/', checkRole("admin"), async function (req, res, next) {
    res.render('admin/index.ejs');
});

router.get('/category/create', checkRole("admin"), async function (req, res, next) {
    res.render('admin/category/create.ejs');
});

router.get('/category', checkRole("admin"), async function (req, res, next) {
    try {
        const responseData = await getCategories();
        const categories = responseData.data;

        if (!Array.isArray(categories)) {
            console.error('Categories không phải là mảng:', categories);
            return ResHelper.ResponseSend(res, false, 500, 'Categories data nhận về không đúng định dạng');
        }

        res.render('admin/category/index.ejs', { categories });
    } catch (error) {
        console.error('Lỗi khi fetching categories:', error);
        ResHelper.ResponseSend(res, false, 500, 'Lỗi khi fetching categories');
    }
});

router.get('/product', checkRole("admin"), async function (req, res, next) {
    try {
        const response = await fetch('http://localhost:3000/api/v1/products/');
        const responseData = await response.json();

        if (!responseData.success) {
            console.error('API request không thành công:', responseData);
            return ResHelper.ResponseSend(res, false, 500, 'API request không thành công');
        }

        const products = responseData.data;

        if (!Array.isArray(products)) {
            console.error('Products không phải là mảng?:', products);
            return ResHelper.ResponseSend(res, false, 500, 'Products data không hợp lệ');
        }

        res.render('admin/product/index.ejs', { products });
    } catch (error) {
        console.error('Lỗi khi fetching products:', error);
        ResHelper.ResponseSend(res, false, 500, 'Lỗi khi fetch products');
    }
});

router.get('/product/create', checkRole("admin"), async function (req, res, next) {
    try {
        const responseData = await getCategories();
        const categories = responseData.data;
        res.render('admin/product/create.ejs', { categories });
    } catch (error) {
        console.error('Lỗi khi fetch categories:', error);
        ResHelper.ResponseSend(res, false, 500, 'Lỗi khi fetch categories');
    }
});


router.get('/product/update', checkRole("admin"), async function (req, res, next) {
    const productId = req.query.id;
    res.render('admin/product/edit.ejs');
});

module.exports = router;
