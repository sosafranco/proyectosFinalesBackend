import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import UserModel from '../dao/models/user.model.js';

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken'];
    }
    return token;
};

passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const { first_name, last_name, age } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });
        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error);
    }
}));

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: 'coderhouse'
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log('JWT Payload:', jwt_payload);
    try {
        const user = await UserModel.findById(jwt_payload.sub);
        if (user) {
            console.log('Usuario encontrado:', user);
            return done(null, user);
        } else {
            console.log('Usuario no encontrado');
            return done(null, false);
        }
    } catch (error) {
        console.error('Error en la estrategia JWT:', error);
        return done(error, false);
    }
}));

export default passport;
