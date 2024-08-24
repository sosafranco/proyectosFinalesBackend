const express = require('express');
const router = express.Router();
// const ProductManager = require('../dao/db/product-manager-db.js');
// const productManager = new ProductManager('../dao/db/fs/data/products.json');

router.get('/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', { title: 'Store', products });
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', { title: 'Real Time Products' });
});

module.exports = router;

