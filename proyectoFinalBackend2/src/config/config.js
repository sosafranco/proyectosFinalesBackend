import dotenv from 'dotenv';

dotenv.config({
    path: './.env.backend',
});

const configObject = {
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT || 3000,
};

export default configObject;