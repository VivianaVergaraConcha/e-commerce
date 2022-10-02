const { Router } = require("express");
const response = require("./response");
const { validatorCompiler } = require("./utils");
const { RoleService } = require("../../services");
const {
  role: { storeRoleSchema, updateRoleSchema, roleIDSchema },
} = require("../../schemas");


const RoleRouter = Router();

RoleRouter.route("/role")
  .post(validatorCompiler(storeRoleSchema, "body"), async (req, res, next) => {
    const {
      body: { name },
    } = req;

    try {
      const roleService = new RoleService({ name });

      response({
        error: false,
        message: await roleService.saveRole(),
        res,
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  })
  .get(async (req, res, next) => {
    try {
      const roleService = new RoleService();

      response({
        error: false,
        message: await roleService.getAllRoles(),
        res,
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  });
RoleRouter.route("/role/:id")
  .get(async (req, res, next) => {
    const {
      params: { id },
    } = req;

    try {
      const roleService = new RoleService({ id });

      response({
        error: false,
        message: await roleService.getRoleByID(),
        res,
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  })
  .patch(
    validatorCompiler(roleIDSchema, "params"),
    validatorCompiler(updateRoleSchema, "body"),
    async (req, res, next) => {
      const {
        body: { name },
        params: { id },
      } = req;

      try {
        response({
          error: false,
          message: await new RoleService({
            id,
            name,
          }).updateOneRole(),
          res,
          status: 200,
        });
      } catch (error) {
        next(error);
      }
    }
  )
  .delete(validatorCompiler(roleIDSchema, "params"), async (req, res, next) => {
    try {
      const {
        params: { id },
      } = req;
      const roleService = new RoleService({ id: id });

      response({
        error: false,
        message: await roleService.removeRoleByID(),
        res,
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  });

module.exports = RoleRouter;
