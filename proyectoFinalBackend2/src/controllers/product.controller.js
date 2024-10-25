import productService from '../services/product.service.js';

class ProductController {
    async getProducts(req, res) {
        const { limit = 10, page = 1, sort, query } = req.query;
        try {
            const products = await productService.getProducts({limit, page, sort, query});
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProductById(req, res) {
        const { id } = req.params;
        try {
            const product = await productService.getProductById(id);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createProduct(req, res) {
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProduct(req, res) {
        const { id } = req.params;
        try {
            const updateProduct = await productService.updateProduct(id, req.body);
            if (!updateProduct) return res.status(404).json({ error: 'Product not found' });
            res.json(updateProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProduct(req, res) {
        const { id } = req.params;
        try {
            const deleteProduct = await productService.deleteProduct(id);
            if (!deleteProduct) return res.status(404).json({ error: 'Product not found' });
            res.json({message: 'Product deleted'});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new ProductController();


