const { UserModel } = require('../models')

/**
 * It saves a user to the database
 * @param {Object} user
 * @param {String} user.name
 * @param {String} user.lastName
 * @param {String} user.email
 * @param {String} user.salt
 * @param {String|undefined} user.hash
 * @param {import('mongoose').Schema.Types.ObjectId} user.role
 * @param {Number} user.balance
 * @returns A promise that resolves to the saved user
 */
const saveUser = async user => {
  const savedUser = new UserModel(user)
  await savedUser.save()

  return savedUser
}

/**
 * @param {String} id
 * @returns found user
 */
const getUserByID = async id => {
  const users = await UserModel.find({ _id: id })

  return users[0]
}

/**
 * @param {Object} user
 * @param {String} user.id
 * @param {String|undefined} user.name
 * @param {String|undefined} user.lastName
 * @param {String|undefined} user.email
 * @param {String|undefined} user.salt
 * @param {String|undefined} user.hash
 * @param {import('mongoose').Schema.Types.ObjectId|undefined} user.role
 * @param {Number} user.balance
 * @returns updated user
 */
const updateOneUser = async user => {
  const { id, name, lastName, email, salt, hash, role, balance } = user
  const userUpdated = await UserModel.findOneAndUpdate(
    { _id: id },
    {
      ...(name && { name }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(role && { role }),
      ...(balance && { balance }),
      ...(salt &&
        hash && {
          salt,
          hash
        })
    },
    { new: true }
  )

  return userUpdated
}

/**
 * @param {String} id
 * @returns found user
 */
const removeUserByID = async id => {
  const user = await UserModel.findOneAndRemove({ _id: id })

  return user
}

/**
 * @returns found users
 */
const getAllUsers = async () => {
  const users = await UserModel.find()

  return users
}

/**
 * It returns the first user in the database that matches the query
 * @param {Object} query - The query object that will be used to find the user.
 * @returns The first user in the database
 */
const getOneUser = async (query = {}) => {
  const users = await UserModel.find(query)

  return users[0]
}

/**
 * @returns found users
 */
const getUsersByRole = async roleId => {
  const users = await UserModel.find({ roleId })

  return users
}

module.exports = {
  saveUser,
  getUserByID,
  updateOneUser,
  removeUserByID,
  getAllUsers,
  getOneUser,
  getUsersByRole
}
