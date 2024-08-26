const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const ProductModel = require("../models/product.model.js");

// Obtenemos el esquema del modelo
const productSchema = ProductModel.schema;
productSchema.plugin(mongoosePaginate);

class ProductManager {

    // async loadProducts() {
    //     try {
    //         const data = await fs.readFile(this.path, 'utf8');
    //         this.products = JSON.parse(data);
    //         if (this.products.length > 0) {
    //             this.lastId = Math.max(
    //                 ...this.products.map((product) => product.id)
    //             );
    //         }
    //     } catch (error) {
    //         console.error('Error loading products from the file', error);
    //         // Si el archivo no existe, se crea.
    //         await this.saveProducts();
    //     }
    // }

    // async saveProducts() {
    //     try {
    //         await fs.writeFile(
    //             this.path,
    //             JSON.stringify(this.products, null, 4)
    //         );
    //     } catch (error) {
    //         console.error('Error saving the file', error);
    //     }
    // }

    async addProduct(newObject) {
        try {
            let {
                title,
                description,
                category,
                price,
                thumbnails,
                stock,
                status,
            } = newObject;

            // Se valida que todos los campos sean obligatorios
            if (
                !title ||
                !description ||
                !category ||
                !price ||
                !stock ||
                !status
            ) {
                console.error('All fields are mandatory.');
                return;
            }

            // Genera un código único
            const code = Date.now().toString();

            // Se agrega un producto con id autoincrementable
            const newProduct = new ProductModel({
                title,
                description,
                category,
                price,
                thumbnails,
                code,
                stock,
                status: true,
            });
            // Se guarda nuevo producto
            await newProduct.save();

            return newProduct;
        } catch (error) {
            console.error('Error adding the product:', error);
            throw error;
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            const result = await ProductModel.paginate(filter, options);
            return result;
        } catch (error) {
            console.log("Error al obtener los productos", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const foundProduct = await ProductModel.findById(id)
            if (!foundProduct) {
                console.error('Product not found. ID:', id);
            } else {
                console.error('Product found:', foundProduct);
                return foundProduct;
            }
        } catch (error) {
            console.error('Error reading the file', error);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const updateProduct = await ProductModel.findByIdAndUpdate(id, updatedProduct);
            if (!updateProduct) {
                console.log("no se encuentra el producto id que estas buscando")
                return null;
            }
            return updateProduct;
        } catch (error) {
            console.error('Error updating the product', error);
        }
    }

    // async deleteProduct(id) {
    //     try {
    //         const deletedProduct = await ProductModel.findByIdAndDelete(id);
    //         if (!deletedProduct) {
    //             console.log("no existe ese producto para eliminar")
    //             return null;
    //         }
    //         return deletedProduct;
    //     } catch (error) {
    //         console.error('Error deleting the product', error);
    //     }
    // }

    async deleteProduct(id) {
        try {
            const objectId = new mongoose.Types.ObjectId(id);
            const deletedProduct = await ProductModel.findByIdAndDelete(objectId);
            if (!deletedProduct) {
                console.log("No existe ese producto para eliminar");
                return null;
            }
            return deletedProduct;
        } catch (error) {
            console.error('Error deleting the product', error);
            throw error; // Propagar el error para manejarlo en el nivel superior
        }
    }

    async getProductsLimit(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        }
        return this.products;
    }
}

module.exports = ProductManager;