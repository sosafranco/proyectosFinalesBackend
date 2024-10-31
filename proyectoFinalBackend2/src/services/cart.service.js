import cartRepository from '../repositories/cart.repository.js';

class CartService {
    async createCart() {
        try {
            const newCart = await cartRepository.createCart();
            console.log('Carrito creado (documento original):', newCart);
            return newCart; // Retornar el documento original, no el DTO
        } catch (error) {
            console.error('Error al crear carrito:', error);
            throw error;
        }
    }

    async getCartById(id) {
        return await cartRepository.getCartById(id);
    }

    async updateCart(id, cartData) {
        return await cartRepository.updateCart(id, cartData);
    }

    async deleteCart(id) {
        return await cartRepository.deleteCart(id);
    }
}

export default new CartService();