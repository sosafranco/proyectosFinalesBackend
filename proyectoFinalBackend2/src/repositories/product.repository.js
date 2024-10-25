import productDao from '../dao/product.dao.js';
import ProductDTO from '../dto/product.dto.js';

class ProductRepository {
    async createProduct(productData) {
        return await productDao.save(productData);
    }

    async getProductById(id) {
        const product = await ProductDao.findById(id);
        return product ? new ProductDTO(product) : null;
    }

    async getProducts(filter = {}, options = {}) {
        const result = await productDao.paginate(filter, options);
        result.docs = result.docs.map(product => new ProductDTO(product));
        return result;
    }

    async updateProduct(id, productData) {
        const updatedProduct = await ProductDao.update(id, productData);
        return new ProductDTO(updatedProduct);
    }

    async deleteProduct(id) {
        return await ProductDao.delete(id);
    }
}

export default new ProductRepository();
