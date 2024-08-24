const ProductModel = require("../models/product.model.js")

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
                code,
                stock,
                status,
            } = newObject;

            // Se valida que todos los campos sean obligatorios
            if (
                !title ||
                !description ||
                !category ||
                !price ||
                !code ||
                !stock ||
                !status
            ) {
                console.error('All fields are mandatory.');
                return;
            }

            // Se valida que no se repita el campo "code"
            const existeCodigo = await ProductModel.findOne({ code: code });
            if (existeCodigo) {
                console.log("el codigo debe ser unico")
                return;
            }

            // Se agrega un producto con id autoincrementable
            const newProduct = ProductModel({
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

            // Se guarda el array actualizado en el archivo
        } catch (error) {
            console.error('Error adding the product:', error);
            return { error: 'Internal Server Error' };
        }
    }

    async getProducts() {
        try {
            const arrayProducts = await ProductModel.find();
            return arrayProducts;
        } catch (error) {
            console.log("error al leer el archivo", error);
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

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                console.log("no existe ese producto para eliminar")
                return null;
            }
            return deletedProduct;
        } catch (error) {
            console.error('Error deleting the product', error);
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
