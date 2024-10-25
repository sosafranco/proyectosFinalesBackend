import express from 'express';
const router = express.Router();
import cartController from '../controllers/cart.controller.js';
import CartManager from '../dao/db/cart-manager-db.js';
import ProductManager from '../dao/db/product-manager-db.js';
import TicketService from '../services/ticket.service.js';
import { generateUniqueCode } from '../utils/cartutil.js';
import { isUser } from '../middleware/auth.js';
import mongoose from 'mongoose';

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCartById);
router.post('/:cid/product/:pid', cartController.addProductToCart);
router.post('/:cid/purchase', isUser, async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { cid } = req.params;
        const cart = await CartManager.getCartById(cid).session(session);
        if (!cart) {
            await session.abortTransaction();
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const failedProducts = [];
        const successfulProducts = [];

        for (const item of cart.products) {
            const product = await ProductManager.getProductById(item.productId).session(session);
            if (product && product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save({ session });
                successfulProducts.push(item);
            } else {
                failedProducts.push(item.productId);
            }
        }

        if (successfulProducts.length > 0) {
            const totalAmount = successfulProducts.reduce((total, item) => total + (item.price * item.quantity), 0);

            const ticket = await TicketService.createTicket({
                code: generateUniqueCode(),
                amount: totalAmount,
                purchaser: req.user.email
            }, { session });

            // Actualizar el carrito para que solo contenga los productos que no se pudieron comprar
            cart.products = cart.products.filter(item => failedProducts.includes(item.productId));
            await cart.save({ session });

            await session.commitTransaction();
            session.endSession();

            res.json({
                status: 'success',
                message: failedProducts.length > 0 ? 'Compra realizada parcialmente' : 'Compra realizada con éxito',
                ticket,
                failedProducts: failedProducts.length > 0 ? failedProducts : undefined
            });
        } else {
            await session.abortTransaction();
            session.endSession();

            res.status(400).json({
                status: 'error',
                message: 'No se pudo procesar ningún producto',
                failedProducts
            });
        }
    } catch (error) {
        console.error('Error en la compra:', error);
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor al procesar la compra'
        });
    }
});

export default router;
