//importamos el DAO
import UserDao from '../dao/user.dao.js';

class userRepository {
    async createUser(userData) {
        return await UserDao.save(userData);
    }

    async getUserById(id) {
        return await UserDao.findById(id);
    }

    async getUserByEmail(email) {
        return await UserDao.findOne({ email });
    }

    async updateUser(id, userData) {
        return await UserDao.update(id, userData);
    }

    async deleteUser(id) {
        return await UserDao.delete(id);
    }
}

export default new userRepository();