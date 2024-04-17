const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');

// Include other necessary routes
router.use('/api/v1/users', require('./users'));
router.use('/api/v1/auth', require('./auth'));
router.use('/api/v1/products', require('./products'));
router.use('/api/v1/categories', require('./categories'));

// Middleware to set navbar content
router.use(function(req, res, next) {
    const navbarContent = fs.readFileSync('views/navbar.ejs', 'utf8');
    res.locals.navbar = navbarContent;
    next();
});

async function fetchUserData(token) {
    try {
        if (!token) return { loggedIn: false, user: null };

        const response = await fetch('http://localhost:3000/api/v1/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const responseData = await response.json();
            if (responseData.success) {
                const user = { name: responseData.data.name };
                return { loggedIn: true, user };
            }
        } else {
            console.error('Failed to fetch user data:', response.statusText);
        }
        return { loggedIn: false, user: null };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { loggedIn: false, user: null };
    }
}

// Index route
router.get('/', async function (req, res, next) {
    try {
        const token = req.cookies.token;
        const { loggedIn, user } = await fetchUserData(token);

        let products = [];
        const productsResponse = await fetch('http://localhost:3000/api/v1/products');
        if (productsResponse.ok) {
            const responseData = await productsResponse.json();
            if (responseData.success) {
                products = responseData.data;
            }
        } else {
            console.error('Failed to fetch products data:', productsResponse.statusText);
        }

        res.render('index.ejs', { loggedIn, user, products });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render('index.ejs', { loggedIn: false, user: null, products: [] });
    }
});

// Login route
router.get('/login', function (req, res, next) {
    const loggedIn = req.cookies.token ? true : false;
    if (loggedIn) {
        return res.redirect('/');
    }
    res.render('login.ejs');
});

// Logout route
router.get('/logout', async function (req, res, next) {
    try {
        const response = await fetch('http://localhost:3000/api/v1/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            res.clearCookie('token');
            res.redirect('/');
        } else {
            res.status(response.status).send('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send('Internal server error');
    }
});

// Shop route
router.get('/shop', async function (req, res, next) {
    const token = req.cookies.token;
    const { loggedIn, user } = await fetchUserData(token);
    try {
        let products = [];
        const productsResponse = await fetch('http://localhost:3000/api/v1/products');
        if (productsResponse.ok) {
            const responseData = await productsResponse.json();
            if (responseData.success) {
                products = responseData.data;
            }
        } else {
            console.error('Failed to fetch products data:', productsResponse.statusText);
        }

        res.render('shop.ejs', {user, products });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render('shop.ejs', {user, products: []});
    }
});

module.exports = router;
