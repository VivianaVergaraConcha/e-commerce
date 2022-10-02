const { Router } = require("express");
const httpErrors = require("http-errors");
const response = require("./response");
const { auth, validatorCompiler } = require("./utils");
const { UserService } = require("../../services");
const {
  user: { storeUserSchema, updateUserSchema, userIDSchema, userLoginSchema },
} = require("../../schemas");

const UserRouter = Router();

UserRouter.route("/").get((req, res) => {
  response({
    error: false,
    message: "Hello world!",
    res,
    status: 200,
  });
});

UserRouter.route("/user/signup").post(
  validatorCompiler(storeUserSchema, "body"),
  async (req, res, next) => {
    try {
      const {
        body: { name, lastName, email, password },
      } = req;

      response({
        error: false,
        message: await new UserService({
          name,
          lastName,
          email,
          password,
        }).saveUser(),
        res,
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.route("/user/login").post(
  validatorCompiler(userLoginSchema, "body"),
  auth.generateTokens(),
  async (req, res, next) => {
    try {
      const {
        accessToken,
        refreshToken,
        body: { email, password },
      } = req;
      const isLoginCorrect = await new UserService({ email, password }).login();

      if (isLoginCorrect)
        return response({
          error: false,
          message: {
            accessToken,
            refreshToken,
          },
          res,
          status: 200,
        });

      throw new httpErrors.Unauthorized("You are not registered");
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.route("/user/refreshAccessToken/:id").get(
  validatorCompiler(userIDSchema, "params"),
  auth.verifyIsCurrentUser(),
  auth.refreshAccessToken(),
  async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = req;

      response({
        error: false,
        message: {
          accessToken,
          refreshToken,
        },
        res,
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.route("/user/:id")
  .get(validatorCompiler(userIDSchema, "params"), async (req, res, next) => {
    try {
      const {
        params: { id: id },
      } = req;
      const userService = new UserService({ id });

      response({
        error: false,
        message: await userService.getUserByID(),
        res,
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  })
  .delete(validatorCompiler(userIDSchema, "params"), async (req, res, next) => {
    try {
      const {
        params: { id },
      } = req;
      const userService = new UserService({ id: id });

      response({
        error: false,
        message: await userService.removeUserByID(),
        res,
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  })
  .patch(
    validatorCompiler(userIDSchema, "params"),
    validatorCompiler(updateUserSchema, "body"),
    async (req, res, next) => {
      const {
        body: { name, lastName, email, password },
        params: { id: id },
      } = req;

      try {
        response({
          error: false,
          message: await new UserService({
            id,
            name,
            lastName,
            email,
            password,
          }).updateOneUser(),
          res,
          status: 200,
        });
      } catch (error) {
        next(error);
      }
    }
  );

UserRouter.route("/user").get(async (req, res, next) => {
  try {
    const userService = new UserService();

    response({
      error: false,
      message: await userService.getAllUsers(),
      res,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = UserRouter;
