import { User } from "../models/user.model.js";

export class UserRepository {

  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }
  async findById(userId) {
    return await User.findById(userId);
  }

  async findAll() {
    return await User.find().select("-password");
  }
  async updateById(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
  }


  async deleteById(userId) {
    return await User.findByIdAndDelete(userId);
  }

  async emailExists(email) {
    const user = await User.findOne({ email });
    return !!user;
  }
}
