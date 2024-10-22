import express from 'express';
import ProductManager from '../src/dao/db/product-manager-db.js';
import CartManager from '../src/dao/db/cart-manager-db.js';
import viewsRouter from './routes/views.router.js';
import http from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import configObject from './config/config.js';
import cors from 'cors';
import nodemailer from 'nodemailer';

//Singleton
import baseDeDatos from './database.js';
const instanciaBD = baseDeDatos.getInstancia();





// Middleware
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));
app.use(
    session({
        secret: "secretCoder",
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl:
                configObject.mongo_url,
            ttl: 100,
        }),
    })
);
app.use(cors());


// Configurar nodemailer

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'fm.sosa01@gmail.com',
        pass: 'ukfi ifxe oczm zszj'
    }
})

//ruta para enviar mail

app.get("/mail", async (req, res) => {
    try {
        await transport.sendMail({
            from: "Tech Store <fm.sosa00@outlook.com>",
            to: "fm.sosa01@gmail.com",
            subject: "Prueba Nodemailer",
            html: "<h1>Probando nodemailer anashe</h1>"
        })
        res.send("Mail enviado!");
    } catch (error) {
        res.status(500).send("No se envió un carajo el mail!");
    }
})

// Configurar Passport
import passport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import sessionsRouter from './routes/sessions.router.js';

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/sessions', sessionsRouter);


const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

const productManager = new ProductManager();
const cartManager = new CartManager();

// Configurar express-handlebars
import { engine } from 'express-handlebars';
app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');


// Rutas de productos y vistas
app.use('/api/products', (await import('./routes/products.router.js')).default(productManager));
app.use('/', viewsRouter);

// Rutas de carritos
const cartRouter = (await import('./routes/cart.router.js')).default;
app.use('/api/carts', cartRouter(cartManager, productManager));

// Configurar socket.io
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');
    const products = await productManager.getProducts();
    socket.emit("products", products.docs);

    // Se escucha eventos del cliente para agregar un producto
    socket.on('addProduct', async (newProduct) => {
        // Se agrega el nuevo producto y se emite la lista actualizada a todos los clientes
        await productManager.addProduct(newProduct);
        io.emit('products', await productManager.getProducts());
    });

    socket.on('deleteProduct', async (id) => {
        try {
            const deletedProduct = await productManager.deleteProduct(id);
            if (deletedProduct) {
                console.log("Producto eliminado correctamente:", deletedProduct);
                const products = await productManager.getProducts();
                io.emit('updateProducts', products);
            } else {
                console.log("No se pudo eliminar el producto con ID:", id);
                socket.emit('deleteError', 'No se pudo eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            socket.emit('deleteError', 'Error al eliminar el producto: ' + error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.set('socketio', io);

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
