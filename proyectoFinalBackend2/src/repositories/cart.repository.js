import CartDao from '../dao/cart.dao.js';
import CartDTO from '../dto/cart.dto.js';

class CartRepository {
    async createCart(userId) {
        const cart = await CartDao.save({ userId, products: [] });
        return new CartDTO(cart);
    }

    async getCartById(id) {
        const cart = await CartDao.findById(id);
        return cart ? new CartDTO(cart) : null;
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartDao.addProduct(cartId, productId, quantity);
        return new CartDTO(cart);
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartDao.removeProduct(cartId, productId);
        return new CartDTO(cart);
    }

    async updateCart(cartId, newProducts) {
        const cart = await CartDao.update(cartId, { products: newProducts });
        return new CartDTO(cart);
    }

    async clearCart(cartId) {
        const cart = await CartDao.update(cartId, { products: [] });
        return new CartDTO(cart);
    }
}

export default new CartRepository();
