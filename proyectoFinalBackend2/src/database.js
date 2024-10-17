import mongoose from 'mongoose';
import configObject from './config/config.js';
const { mongo_url } = configObject;

class baseDeDatos {
    static#instancia;

    constructor() {
        mongoose.connect(mongo_url);
    }

    static getInstancia() {
        if (this.#instancia) {
            console.log('Instancia ya creada');
            return this.#instancia;
        }

        this.#instancia = new baseDeDatos();
        console.log('Conexión a la base de datos exitosa');
    }
}

export default baseDeDatos;