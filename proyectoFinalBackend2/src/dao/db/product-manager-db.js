import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import ProductModel from '../models/product.model.js';
import ProductDTO from '../../dto/product.dto.js';
import productRepository from '../../repositories/product.repository.js';

// Obtenemos el esquema del modelo
const productSchema = ProductModel.schema;
productSchema.plugin(mongoosePaginate);

class ProductManager {

    async addProduct(newObject) {
        try {
            return await productRepository.createProduct(newObject);
        } catch (error) {
            console.error('Error adding the product:', error);
            throw error;
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            return await productRepository.getProducts(filter, options);
        } catch (error) {
            console.error('Error getting the products', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await productRepository.getProductById(id);
        } catch (error) {
            console.error('Error getting the product', error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            return await productRepository.updateProduct(id, updatedFields);
        } catch (error) {
            console.error('Error updating the product', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await productRepository.deleteProduct(id);
        } catch (error) {
            console.error('Error deleting the product', error);
            throw error;
        }
    }
}

export default ProductManager;
