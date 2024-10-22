import UserModel from "./models/user.model.js";

class UserDao {
    async findById(id) {
        return await UserModel.findById(id);
    }

    async findOne(query) {
        return await UserModel.findOne(query);
    }

    async save(data) {
        const user = new UserModel(data);
        return await user.save();
    }
}

export default new UserDao();