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

            userData.password = createHash(userData.password);

            // Se crea un nuevo carrito
            const nuevoCarrito = await cartService.createCart();
            userData.cart = nuevoCarrito._id; // Asignar el ID del carrito

            const nuevoUsuario = await userRepository.createUser(userData);
            console.log('Usuario creado:', nuevoUsuario); // Verifica que el usuario se haya creado

            return nuevoUsuario;
        } catch (error) {
            console.error('Error en registerUser:', error);
            throw error;
        }
    }

    async loginUser(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user) throw new Error('Usuario no encontrado');

        if (!isValidPassword(password, user)) throw new Error('Contraseña incorrecta');

        return user;
    }
}

export default new UserService();
