const httpErrors = require('http-errors')
const {
  role: { ROLE_IDS, ROLE_NAMES }
} = require('../util')
const {
  mongo: { queries }
} = require('../database')
const {
  role: {
    saveRole,
    getRoleByID,
    updateOneRole,
    removeRoleByID,
    getRoleByName,
    getAllRoles,
    getRoleByCode
  }
} = queries

class RoleService {
  #id
  #code
  #name

  /**
   * @param {Object} args
   * @param {String} args.id
   * @param {Integer} args.code
   * @param {String} args.name
   */
  constructor(args = {}) {
    const { id, code, name = '' } = args

    this.#id = id
    this.#code = code
    this.#name = name
  }

  async verifyRolExists() {
    if (!this.#code)
      throw new httpErrors.BadRequest('Missing required field: code')

    const role = await getRoleByID(this.#code)

    if (!role) throw new httpErrors.NotFound('Role not found')

    return role
  }

  async saveRole() {
    if (!this.#code)
      throw new httpErrors.BadRequest('Missing required field: code')

    if (!ROLE_IDS.includes(`${code}`))
      throw new httpErrors.BadRequest('Role code not allowed')

    if (!this.#name)
      throw new httpErrors.BadRequest('Missing required field: name')

    if (!ROLE_NAMES.includes(this.#name))
      throw new httpErrors.BadRequest('Role name not allowed')

    const roleExists = await getRoleByName(this.#name)

    if (roleExists) throw new httpErrors.Conflict('Role already exists')

    return await saveRole({ code: this.#code, name: this.#name })
  }

  async getRoleByID() {
    if (!this.#id) throw new httpErrors.BadRequest('Missing required field: id')

    const role = await getRoleByID(this.#id)

    if (!role)
      throw new httpErrors.NotFound('The requested rol does not exists')

    return role
  }

  async updateOneRole() {
    if (!this.#id) throw new httpErrors.BadRequest('Missing required field: id')

    return await updateOneRole({
      id: this.#id,
      name: this.#name
    })
  }

  async removeRoleByID() {
    if (!this.#id) throw new httpErrors.BadRequest('Missing required field: id')

    const role = await removeRoleByID(this.#id)

    if (!role)
      throw new httpErrors.NotFound('The requested role does not exists')

    return role
  }

  async getAllRoles() {
    return await getAllRoles()
  }

  async getRoleByCode() {
    if (!this.#code)
      throw new httpErrors.BadRequest('Missing required field: code')

    const role = await getRoleByCode(this.#code)

    if (!role)
      throw new httpErrors.NotFound('The requested rol does not exists')

    return role
  }
}

module.exports = RoleService
