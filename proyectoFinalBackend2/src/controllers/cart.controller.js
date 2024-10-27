import cartService from '../services/cart.service.js';

class CartController {
    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCartById(req, res) {
        const { id } = req.params;
        try {
            const cart = await cartService.getCartById(id);
            if (!cart) return res.status(404).json({ error: 'Cart not found' });
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).json({ error: 'Cart not found' });

            const parsedQuantity = parseInt(quantity, 10);
            const existingProduct = cart.products.find(item => item.product.toString() === pid);
            if (existingProduct) {
                existingProduct.quantity += parsedQuantity;
            } else {
                cart.products.push({ product: pid, quantity: parsedQuantity });
            }
            await cartService.updateCart(cid, cart);
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default new CartController();
