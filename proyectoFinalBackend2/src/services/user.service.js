import userRepository from '../repositories/user.repository.js';
import { createHash, isValidPassword } from '../utils/util.js';
import cartService from './cart.service.js';

class UserService {
    async getUserByEmail(email) {
        return await userRepository.getUserByEmail(email);
    }

    async registerUser(userData) {
        try {
            const existeUsuario = await this.getUserByEmail(userData.email);
            if (existeUsuario) throw new Error('El usuario ya existe');

            // Crear carrito
            const nuevoCarrito = await cartService.createCart();
            console.log('Carrito creado (documento):', nuevoCarrito);

            // Verificar el _id del carrito
            if (!nuevoCarrito || !nuevoCarrito._id) {
                console.error('Carrito creado sin _id:', nuevoCarrito);
                throw new Error('Error al crear el carrito: ID no generado');
            }

            // Crear usuario con el carrito y password hasheado
            const userToCreate = {
                ...userData,
                password: createHash(userData.password), // Hashear password
                cart: nuevoCarrito._id
            };

            const nuevoUsuario = await userRepository.createUser(userToCreate);
            console.log('Usuario creado:', nuevoUsuario);

            return nuevoUsuario;
        } catch (error) {
            console.error('Error detallado:', error);
            throw error;
        }
    }

    async updateUser(id, userData) {
        return await userRepository.updateUser(id, userData);
    }

    async loginUser(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user) throw new Error('Usuario no encontrado');

        if (!isValidPassword(password, user)) {
            throw new Error('Contraseña incorrecta');
        }

        return user;
    }
}

export default new UserService();
