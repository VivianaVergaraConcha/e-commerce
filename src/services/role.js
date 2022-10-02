const httpErrors = require("http-errors");
const { nanoid } = require("nanoid");

const {
  mongo: { queries },
} = require("../database");
const {
  role: {
    saveRole,
    getRoleByID,
    updateOneRole,
    removeRoleByID,
    getRoleByName,
    getAllRoles,
  },
} = queries;

class RoleService {
  #id;
  #name;

  /**
   * @param {Object} args
   * @param {String} args.id
   * @param {String} args.name
   */
  constructor(args = {}) {
    const { id, name = "" } = args;

    this.#id = id;
    this.#name = name;
  }

  async verifyRolExists() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    const role = await getRoleByID(this.#id);

    if (!role) throw new httpErrors.NotFound("Role not found");

    return role;
  }

  async saveRole() {
    if (!this.#name)
      throw new httpErrors.BadRequest("Missing required field: name");

    const roleExists = await getRoleByName(this.#name);

    if (roleExists) throw new httpErrors.Conflict("Role already exists");

    return await saveRole({ id: nanoid(), name: this.#name });
  }

  async getRoleByID() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    const role = await getRoleByID(this.#id);

    if (!role)
      throw new httpErrors.NotFound("The requested rol does not exists");

    return role;
  }

  async updateOneRole() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    return await updateOneRole({
      id: this.#id,
      name: this.#name,
    });
  }

  async removeRoleByID() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    const role = await removeRoleByID(this.#id);

    if (!role)
      throw new httpErrors.NotFound("The requested role does not exists");

    return role;
  }

  async getAllRoles() {
    return await getAllRoles();
  }
}

module.exports = RoleService;
