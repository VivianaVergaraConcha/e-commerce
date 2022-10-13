const httpErrors = require("http-errors");
const RoleService = require("./role");
const {
  hash: { hashString },
} = require("../util");
const {
  mongo: { queries },
} = require("../database");
const {
  user: {
    saveUser,
    getUserByID,
    updateOneUser,
    removeUserByID,
    getAllUsers,
    getOneUser,
  },
} = queries;

class UserService {
  #id;
  #name;
  #lastName;
  #email;
  #password;
  #role;
  #balance;

  /**
   * @param {Object} args
   * @param {String} args.id
   * @param {String} args.name
   * @param {String} args.lastName
   * @param {String} args.email
   * @param {String} args.password
   * @param {String} args.role
   * @param {Number} args.balance
   */
  constructor(args = {}) {
    const {
      id = "",
      name = "",
      lastName = "",
      email = "",
      password = "",
      role = "",
      balance = 0,
    } = args;

    this.#id = id;
    this.#name = name;
    this.#lastName = lastName;
    this.#email = email;
    this.#password = password;
    this.#role = role;
    this.#balance = balance;
  }

  async verifyUserExists() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    const user = await getUserByID(this.#id);

    if (!user) throw new httpErrors.NotFound("User not found");

    return user;
  }

  async saveUser() {
    if (!this.#name)
      throw new httpErrors.BadRequest("Missing required field: name");

    if (!this.#lastName)
      throw new httpErrors.BadRequest("Missing required field: lastName");

    if (!this.#email)
      throw new httpErrors.BadRequest("Missing required field: email");

    if (!this.#password)
      throw new httpErrors.BadRequest("Missing required field: password");

    if (!this.#role)
      throw new httpErrors.BadRequest("Missing required field: role");

    const role = await new RoleService({ code: this.#role }).getRoleByCode();
    const { salt, result: hash } = hashString(this.#password);

    return await saveUser({
      name: this.#name,
      lastName: this.#lastName,
      email: this.#email,
      salt,
      hash,
      role: role._id,
      balance: this.#balance,
    });
  }

  async getUserByID() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    const user = await getUserByID(this.#id);

    if (!user)
      throw new httpErrors.NotFound("The requested user does not exists");

    return user;
  }

  async updateOneUser() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    await this.verifyUserExists();

    const updatePassword = !!this.#password;
    const aux = {};

    if (updatePassword) {
      const { salt, result: hash } = hashString(this.#password);

      aux.salt = salt;
      aux.hash = hash;
    }

    if (this.#role) {
      const role = await new RoleService({ code: this.#role }).getRoleByCode();
      this.#role = role._id;
    }

    return await updateOneUser({
      id: this.#id,
      name: this.#name,
      lastName: this.#lastName,
      email: this.#email,
      role: this.#role,
      balance: this.#balance,
      ...aux,
    });
  }

  async removeUserByID() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    const user = await removeUserByID(this.#id);

    if (!user)
      throw new httpErrors.NotFound("The requested user does not exists");

    return user;
  }

  async getAllUsers() {
    return await getAllUsers();
  }

  async login() {
    if (!this.#email)
      throw new httpErrors.BadRequest("Missing required field: email");

    if (!this.#password)
      throw new httpErrors.BadRequest("Missing required field: password");

    const user = await getOneUser({ email: this.#email });

    if (!user) throw new httpErrors.BadRequest("Bad credentials");

    const { salt, hash } = user;
    const { result } = hashString(this.#password, salt);

    if (hash !== result) throw new httpErrors.BadRequest("Bad credentials");

    return user;
  }

  async chargeBalance(amount) {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    const user = await getUserByID(this.#id);

    return await updateOneUser({
      id: user.id,
      balance: user.balance + amount,
    });
  }

  async getBalance() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    const user = await getUserByID(this.#id);

    return user.balance;
  }
}

module.exports = UserService;
