import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

class CartManager {
    async createCart() {
        try {
            const newCart = await CartModel.create({ products: [] });
            return newCart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw new Error('No se pudo crear el carrito');
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw new Error('No se pudo obtener el carrito');
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw new Error('No se pudo agregar el producto al carrito');
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            throw new Error('No se pudo eliminar el producto del carrito');
        }
    }

    async updateCartProducts(cartId, products) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = products;
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al actualizar productos del carrito:', error);
            throw new Error('No se pudieron actualizar los productos del carrito');
        }
    }
}

export default CartManager;
