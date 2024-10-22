import config from '../config/config.js';
import fileSystemProductsDao from './fileSystemProductsDao.js';
import memoryProductsDao from './memoryProductsDao.js';
import mongoDBProductsDao from './mongoDBProductsDao.js';

let DAO;

switch(config.persistance) {
    case 'file':
        DAO = fileSystemProductsDao;
        break;
    case 'memory':
        DAO = memoryProductsDao;
        break;
    case 'mongo':
        DAO = mongoDBProductsDao;
        break;
    default:
        throw new Error('Persistencia inválida');
}

export default DAO;