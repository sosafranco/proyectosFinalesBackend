import userService from "../services/user.service.js";
import jwt from 'jsonwebtoken';
import UserDTO from "../dto/user.dto.js";

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;

        try {
            const existeUsuario = await userService.getUserByEmail(email);

            if (existeUsuario) {
                return res.status(400).render('register', { error: 'El usuario ya existe' });
            }

            const nuevoUsuario = await userService.registerUser({first_name, last_name, email, age, password});

            const token = jwt.sign({
                usuario: `${nuevoUsuario.first_name} ${nuevoUsuario.last_name}`,
                email: nuevoUsuario.email,
                role: nuevoUsuario.role,
            }, "coderhouse", { expiresIn: '1h' });

            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });
            res.redirect("/api/sessions/current");
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            res.status(500).render('register', { error: 'Error al crear el usuario' });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        try {
            const usuario = await userService.loginUser(email, password);

            const token = jwt.sign({
                sub: usuario._id,
                usuario: `${usuario.first_name} ${usuario.last_name}`,
                email: usuario.email,
                role: usuario.role,
            }, "coderhouse", { expiresIn: '1h' });

            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });
            return res.redirect("/api/sessions/current");
        } catch (error) {
            return res.status(400).render('login', { error: error.message });
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
