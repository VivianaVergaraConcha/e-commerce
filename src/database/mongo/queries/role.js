const { RoleModel } = require("../models");

/**
 * It takes a role object, creates a new RoleModel instance, saves it, and returns
 * the saved role
 * @param {Object} role
 * @param {Number} role.code
 * @param {String} role.name
 * @returns The savedRole is being returned.
 */
const saveRole = async (role) => {
  const savedRole = new RoleModel(role);
  await savedRole.save();

  return savedRole;
};

/**
 * Get a role by its ID.
 * @param {String} id
 * @returns The first role in the array of roles.
 */
const getRoleByID = async (id) => {
  const roles = await RoleModel.find({ _id: id });

  return roles[0];
};

/**
 * Update the role.
 * @param {Object} role
 * @param {String} role.id
 * @param {Number} role.code
 * @param {String|undefined} role.name
 * @returns updated role
 */
const updateOneRole = async (role) => {
  const { id, name } = role;
  const roleUpdated = await RoleModel.findOneAndUpdate(
    { _id: id },
    { code },
    { name },
    { new: true }
  );

  return roleUpdated;
};

/**
 * Remove the role by id.
 * @param {String} id
 * @returns found role
 */
const removeRoleByID = async (id) => {
  const role = await RoleModel.findOneAndRemove({ _id: id });

  return role;
};

/**
 * Get the role by name.
 * @param {String} name
 * @returns The first role in the array of roles.
 */
const getRoleByName = async (name) => {
  const roles = await RoleModel.find({ name });

  return roles[0];
};

/**
 * @returns found roles
 */
const getAllRoles = async () => {
  const roles = await RoleModel.find();

  return roles;
};

/**
 * Get a role by code
 * @param {String} code
 * @returns The first role in the array of roles.
 */
const getRoleByCode = async (code) => {
  const roles = await RoleModel.find({ code });

  return roles[0];
};

module.exports = {
  saveRole,
  getRoleByID,
  updateOneRole,
  removeRoleByID,
  getRoleByName,
  getAllRoles,
  getRoleByCode,
};
