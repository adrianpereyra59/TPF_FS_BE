import Users from "../models/User.model.js";

class UserRepository {
  static async createUser(name, email, password) {
    // Devuelve el documento creado
    const user = await Users.create({
      name,
      email,
      password,
    });
    return user;
  }

  static async getAll() {
    const users = await Users.find();
    return users;
  }

  static async getById(user_id) {
    const user_found = await Users.findById(user_id);
    return user_found;
  }

  static async deleteById(user_id) {
    await Users.findByIdAndDelete(user_id);
    return true;
  }

  static async updateById(user_id, new_values) {
    const user_updated = await Users.findByIdAndUpdate(user_id, new_values, {
      new: true,
    });
    return user_updated;
  }

  static async getByEmail(email) {
    const user = await Users.findOne({ email: email });
    return user;
  }
}

export default UserRepository;


//Un metodo o propiedad estatica puede ser llamada desde la clase, sin necesidad de instanciar dicha clase
//Por que usar estaticos? para no tener mas de una instancia del userRepository






/* 
const userRepository = new UserRepository()
userRepository.createUser() 
*/