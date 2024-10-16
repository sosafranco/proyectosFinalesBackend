import dotenv from 'dotenv';

// Cargar el archivo .env.backend directamente
dotenv.config({
    path: './.env.backend',
});

const configObject = {
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT || 3000, // También puedes cargar el puerto desde el archivo .env.backend
};

export default configObject;