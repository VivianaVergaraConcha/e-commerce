const { Router } = require("express");
const httpErrors = require("http-errors");
const response = require("./response");
const { auth, validatorCompiler } = require("./utils");
const { UserService } = require("../../services");
const {
  user: {
    storeUserSchema,
    updateUserSchema,
    userIDSchema,
    userLoginSchema,
    chargeSchema,
  },
} = require("../../schemas");

const UserRouter = Router();

UserRouter.route("/").get((req, res) => {
  response({
    error: false,
    message: "Hello! Welcome to e-commerce",
    res,
    status: 200,
  });
});

UserRouter.route("/user/signup").post(
  validatorCompiler(storeUserSchema, "body"),
  async (req, res, next) => {
    try {
      const {
        body: { name, lastName, email, password, role, balance },
      } = req;

      response({
        error: false,
        message: await new UserService({
          name,
          lastName,
          email,
          password,
          role,
          balance,
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
  .get(
    validatorCompiler(userIDSchema, "params"),
    auth.verifyIsCurrentUser(),
    async (req, res, next) => {
      try {
        const {
          params: { id },
        } = req;

        response({
          error: false,
          message: await new UserService({ id }).getUserByID(),
          res,
          status: 200,
        });
      } catch (error) {
        next(error);
      }
    }
  )
  .patch(
    validatorCompiler(userIDSchema, "params"),
    validatorCompiler(updateUserSchema, "body"),
    auth.verifyIsCurrentUser(),
    async (req, res, next) => {
      const {
        body: { name, lastName, email, password, role, balance },
        params: { id },
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
            role,
            balance,
          }).updateOneUser(),
          res,
          status: 200,
        });
      } catch (error) {
        next(error);
      }
    }
  )
  .delete(
    validatorCompiler(userIDSchema, "params"),
    auth.verifyIsCurrentUser(),
    async (req, res, next) => {
      try {
        const {
          params: { id },
        } = req;

        response({
          error: false,
          message: await new UserService({ id }).removeUserByID(),
          res,
          status: 200,
        });
      } catch (error) {
        next(error);
      }
    }
  );

UserRouter.route("/user").get(auth.verifyUser(), async (req, res, next) => {
  try {
    response({
      error: false,
      message: await new UserService().getAllUsers(),
      res,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

UserRouter.route("/user/charge").post(
  validatorCompiler(chargeSchema, "body"),
  auth.verifyUser(),
  async (req, res, next) => {
    try {
      const {
        userID,
        body: { amount },
      } = req;

      response({
        error: false,
        message: await new UserService({ id: userID }).chargeBalance(amount),
        res,
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = UserRouter;
