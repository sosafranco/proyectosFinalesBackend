import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import ProductModel from '../models/product.model.js';

// Obtenemos el esquema del modelo y agregamos el plugin de paginación
const productSchema = ProductModel.schema;
productSchema.plugin(mongoosePaginate);

class ProductManager {

    async addProduct(newObject) {
        const { title, description, category, price, thumbnails, stock, status } = newObject;

        // Validar que todos los campos sean obligatorios
        if (!title || !description || !category || !price || !stock || !status) {
            throw new Error('Todos los campos son obligatorios');
        }

        // Generar un código único
        const code = Date.now().toString();

        // Crear y guardar un nuevo producto
        const newProduct = new ProductModel({
            title, description, category, price, thumbnails, code, stock, status: true,
        });

        try {
            await newProduct.save();
            console.log('Producto agregado con éxito:', newProduct);
            return newProduct;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            throw new Error('No se pudo agregar el producto');
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            return await ProductModel.paginate(filter, options);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw new Error('No se pudieron obtener los productos');
        }
    }

    async getProductById(id) {
        try {
            const foundProduct = await ProductModel.findById(id);
            if (!foundProduct) {
                throw new Error('Producto no encontrado');
            }
            return foundProduct;
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            throw new Error('No se pudo obtener el producto');
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const updateProduct = await ProductModel.findByIdAndUpdate(id, updatedProduct, { new: true });
            if (!updateProduct) {
                throw new Error('Producto no encontrado');
            }
            return updateProduct;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw new Error('No se pudo actualizar el producto');
        }
    }

    async deleteProduct(id) {
        try {
            const objectId = new mongoose.Types.ObjectId(id);
            const deletedProduct = await ProductModel.findByIdAndDelete(objectId);
            if (!deletedProduct) {
                throw new Error('Producto no encontrado');
            }
            return deletedProduct;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw new Error('No se pudo eliminar el producto');
        }
    }

    async getProductsLimit(limit) {
        try {
            return limit ? this.products.slice(0, limit) : this.products;
        } catch (error) {
            console.error('Error al obtener los productos con límite:', error);
            throw new Error('No se pudieron obtener los productos con límite');
        }
    }
}

export default ProductManager;