import CartModel from "./models/cart.model.js";
import Cart from './models/cart.model.js';

class CartDao {
    async findById(id) {
        return await Cart.findById(id).populate('products.product', 'title price');
    }

    async save(cartData) {
        const cart = new CartModel(cartData);
        return await cart.save();
    }

    async update(id, cartData) {
        return await Cart.findByIdAndUpdate(id, cartData);
    }

    async delete(id) {
        return await Cart.findByIdAndDelete(id);
    }
}

export default new CartDao();
