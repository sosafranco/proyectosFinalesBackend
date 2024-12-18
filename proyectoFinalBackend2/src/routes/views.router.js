import express from 'express';
import ProductManager from '../dao/db/product-manager-db.js';
import CartManager from '../dao/db/cart-manager-db.js';
import passport from 'passport';
import { isAdmin, isUser } from '../middleware/auth.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/products', isUser, async (req, res) => {
    try {
        const userCartId = req.user.cart;
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
        };

        let filter = {};
        if (query) {
            filter = { category: query };
        }

        const result = await productManager.getProducts(filter, options);

        res.render('index', {
            payload: result.docs, // Asegúrate de que estés pasando los productos como 'payload'
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            cartId: userCartId,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).render('error', { message: 'Error interno del servidor' });
    }
});

router.get('/realtimeproducts', isAdmin, async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error getting the products', error);
        res.status(500).render('error', { message: 'Error interno del servidor' });
    }
});

router.get('/carts/:cid', isUser, async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        const cartTotal = cart.products.reduce((total, item) => total + (item.product.price * item.quantity), 0);
        res.render('cart', { products: cart.products, cartTotal });
    } catch (error) {
        console.error('Error retrieving the cart', error);
        res.status(500).render('error', { message: 'Error interno del servidor' });
    }
});


//detalles del producto
router.get('/products/:pid', isUser, async (req, res) => {
    const userCartId = req.user.cart;
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        res.render('productDetails', { product, cartId: userCartId });
    } catch (error) {
        console.error('Error getting the product details', error);
        res.status(500).render('error', { message: 'Error interno del servidor' });
    }
});

//nuevas rutas para el perfil
router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('profile', { user: req.user });
});

router.get('/admin', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.role === 'admin') {
        res.render('admin');
    } else {
        res.redirect('/profile');
    }
});

export default router;
