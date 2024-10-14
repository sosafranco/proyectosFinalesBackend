import dotenv from 'dotenv';
import program from '../utils/commander.js';

const {mode} = program.opts();

dotenv.config({path: `./src/config/${mode}.env`});

const configObjet = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
}

export default configObjet;