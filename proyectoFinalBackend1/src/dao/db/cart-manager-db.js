const CartModel = require("../models/cart.model.js");

class CartManager {

    async createCart() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("error al crear carrito de compras")
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error(`No cart exists with the id ${cartId}`);
            }
            return cart;
        } catch (error) {
            console.error('Error retrieving the cart by id', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, productManager, quantity = 1) {
        try {
            // Se verifica si el producto existe en el array de productos
            const product = await productManager.getProductById(productId);

            if (!product) {
                return productId;
            }

            const cart = await this.getCartById(cartId);
            const productsExist = cart.products.find(
                (p) => p.product === productId
            );

            if (productsExist) {
                productsExist.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            // marcar la propiedad "products" como modidifcada antes de guardar
            cart.markModified("products")
            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error adding a product to the cart', error);
        }
    }
}

module.exports = CartManager;
