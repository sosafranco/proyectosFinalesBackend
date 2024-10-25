import cartRepository from '../../repositories/cart.repository.js';

class CartManager {
    async createCart() {
        try {
            return await cartRepository.createCart();
        } catch (error) {
            console.error('Error creating the cart:', error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            return await cartRepository.getCartById(cartId);
        } catch (error) {
            console.error('Error getting the cart:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, productManager, quantity = 1) {
        try {
            const product = await productManager.getProductById(productId);
            if (!product) {
                throw new Error(`Product with id ${productId} does not exist`);
            }

            const cart = await this.getCartById(cartId);
            const productInCart = cart.products.find((p) => p.product === productId);

            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await this.saveCarts();
            return cart;
        } catch (error) {
            console.error('Error adding a product to the cart', error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            return await cartRepository.removeProductFromCart(cartId, productId);
        } catch (error) {
            console.error('Error removing a product from the cart', error);
            throw error;
        }
    }

    async updateCart(cartId, newProducts) {
        try {
            return await cartRepository.updateCart(cartId, newProducts);
        } catch (error) {
            console.error('Error updating the cart', error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            return await cartRepository.clearCart(cartId);
        } catch (error) {
            console.error('Error clearing the cart', error);
            throw error;
        }
    }
}

export default CartManager;
