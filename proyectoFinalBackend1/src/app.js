const express = require('express');
// const ProductManager = require('../src/dao/fs/controllers/ProductManager.js');
// const CartManager = require('../src/dao/fs/controllers/CartManager.js');
const ProductManager = require('../src/dao/db/product-manager-db.js');
const CartManager = require('../src/dao/db/cart-manager-db.js');
const viewsRouter = require('./routes/views.router.js');
const http = require('http');
const { Server } = require('socket.io');
require("./database.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

// const productManager = new ProductManager('../src/dao/fs/data/products.json');
// const cartManager = new CartManager('../src/dao/fs/data/carts.json');
const productManager = new ProductManager();
const cartManager = new CartManager();


// Configurar express-handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));

// Rutas de productos y vistas
app.use('/api/products', require('./routes/products.router')(productManager));
app.use('/', viewsRouter);

// Rutas de carritos
// app.use('/api/carts', require('./routes/cart.router')(cartManager));

const cartRouter = require('./routes/cart.router.js')
app.use('/api/carts', cartRouter(cartManager)) // Rutas de carritos

// Configurar socket.io
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // Se emite la lista de productos al cliente cuando se conecta
    socket.emit("products", await productManager.getProducts());

    // Se escucha eventos del cliente para agregar un producto
    socket.on('addProduct', async (newProduct) => {
        // Se agrega el nuevo producto y emite la lista actualizada a todos los clientes
        await productManager.addProduct(newProduct);
        io.emit('products', await productManager.getProducts());
    });

    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        const products = await productManager.getProducts();
        io.emit('updateProducts', products);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.set('socketio', io);

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
