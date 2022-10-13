const { Router } = require('express')
const response = require('./response')
const { auth, validatorCompiler } = require('./utils')
const { RoleService } = require('../../services')
const {
  role: { storeRoleSchema, updateRoleSchema, roleIDSchema }
} = require('../../schemas')

const RoleRouter = Router()

RoleRouter.route('/role')
  .post(
    validatorCompiler(storeRoleSchema, 'body'),
    auth.verifyUser(),
    async (req, res, next) => {
      try {
        const {
          body: { name }
        } = req

        response({
          error: false,
          message: await new RoleService({ name }).saveRole(),
          res,
          status: 201
        })
      } catch (error) {
        next(error)
      }
    }
  )
  .get(auth.verifyUser(), async (req, res, next) => {
    try {
      response({
        error: false,
        message: await new RoleService().getAllRoles(),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  })
RoleRouter.route('/role/:id')
  .get(
    validatorCompiler(roleIDSchema, 'params'),
    auth.verifyUser(),
    async (req, res, next) => {
      try {
        const {
          params: { id }
        } = req

        response({
          error: false,
          message: await new RoleService({ id }).getRoleByID(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )
  .patch(
    validatorCompiler(roleIDSchema, 'params'),
    validatorCompiler(updateRoleSchema, 'body'),
    auth.verifyUser(),
    async (req, res, next) => {
      try {
        const {
          body: { name },
          params: { id }
        } = req

        response({
          error: false,
          message: await new RoleService({
            id,
            name
          }).updateOneRole(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )
  .delete(
    validatorCompiler(roleIDSchema, 'params'),
    auth.verifyUser(),
    async (req, res, next) => {
      try {
        const {
          params: { id }
        } = req

        response({
          error: false,
          message: await new RoleService({ id }).removeRoleByID(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )

module.exports = RoleRouter
