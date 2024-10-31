import userService from "../services/user.service.js";
import cartService from "../services/cart.service.js"; // Importar el servicio de carrito
import jwt from 'jsonwebtoken';
import UserDTO from "../dto/user.dto.js";

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;

        try {
            const newUser = await userService.registerUser({
                first_name,
                last_name,
                email,
                password,
                age
            });

            // Verificar que el usuario tiene carrito
            if (!newUser.cart) {
                throw new Error('Error al asignar carrito al usuario');
            }

            const token = jwt.sign({
                sub: newUser._id,
                usuario: `${newUser.first_name} ${newUser.last_name}`,
                email: newUser.email,
                cart: newUser.cart,
                role: newUser.role,
            }, "coderhouse", { expiresIn: '1h' });

            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });
            res.redirect("/api/sessions/current");
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            res.status(500).render('register', { error: error.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await userService.loginUser(email, password);

            if (!user) {
                return res.status(401).render('login', { error: 'Credenciales incorrectas' });
            }

            const token = jwt.sign({
                sub: user._id,
                usuario: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role,
            }, "coderhouse", { expiresIn: '1h' });

            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });
            res.redirect("/api/sessions/current");
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).render('login', { error: 'Error al iniciar sesión' });
        }
    }

    async current(req, res) {
        if (req.user) {
            const userDTO = new UserDTO(req.user);
            res.render('profile', { user: userDTO });
        } else {
            res.status(401).render('login', { error: 'No autorizado' });
        }
    }

    async logout(req, res) {
        res.clearCookie('coderCookieToken');
        res.redirect("/login");
    }
}

export default UserController;
