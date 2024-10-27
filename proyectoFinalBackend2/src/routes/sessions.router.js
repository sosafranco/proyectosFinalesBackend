import { Router } from 'express';
import passport from 'passport';
import UserController from '../controllers/user.controller.js';
import UserModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils/util.js';
import generateToken from '../utils/jsonwebtoken.js';

const userController = new UserController();
const router = Router();

router.use((req, res, next) => {
    console.log('Datos de la solicitud:', req.body);
    next();
});

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/current', passport.authenticate('jwt', { session: false }), userController.current);

export default router;
