const { Router } = require('express')
const response = require('./response')
const { auth, validatorCompiler } = require('./utils')
const { ArticleService } = require('../../services')
const {
  article: { storeArticleSchema, updateArticleSchema, articleIDSchema }
} = require('../../schemas')

const ArticleRouter = Router()

ArticleRouter.route('/article').post(
  validatorCompiler(storeArticleSchema, 'body'),
  auth.verifyUser(),
  async (req, res, next) => {
    try {
      const {
        userID,
        body: { name, price, description }
      } = req

      response({
        error: false,
        message: await new ArticleService({
          name,
          price,
          description,
          owner: userID
        }).saveArticle(),
        res,
        status: 201
      })
    } catch (error) {
      next(error)
    }
  }
)
ArticleRouter.route('/article/:id')
  .get(
    validatorCompiler(articleIDSchema, 'params'),
    auth.verifyUser(),
    async (req, res, next) => {
      try {
        const {
          params: { id }
        } = req

        response({
          error: false,
          message: await new ArticleService({ id }).getArticleByID(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )
  .patch(
    validatorCompiler(articleIDSchema, 'params'),
    validatorCompiler(updateArticleSchema, 'body'),
    auth.verifyUser(),
    async (req, res, next) => {
      const {
        params: { id },
        body: { name, price, description, owner }
      } = req

      try {
        response({
          error: false,
          message: await new ArticleService({
            id,
            name,
            price,
            description,
            owner
          }).updateOneArticle(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )
  .delete(
    validatorCompiler(articleIDSchema, 'params'),
    auth.verifyIsOwnerOfArticle(),
    async (req, res, next) => {
      try {
        const {
          params: { id }
        } = req

        response({
          error: false,
          message: await new ArticleService({ id }).removeArticleByID(),
          res,
          status: 200
        })
      } catch (error) {
        next(error)
      }
    }
  )

ArticleRouter.route('/article/user/:id').get(
  validatorCompiler(articleIDSchema, 'params'),
  auth.verifyUser(),
  async (req, res, next) => {
    try {
      const {
        params: { id }
      } = req

      response({
        error: false,
        message: await new ArticleService({ owner: id }).getArticleByOwner(),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  }
)

ArticleRouter.route('/article/:id/buy').post(
  validatorCompiler(articleIDSchema, 'params'),
  auth.verifyUser(),
  async (req, res, next) => {
    try {
      const {
        userID,
        params: { id }
      } = req

      response({
        error: false,
        message: await new ArticleService({ id }).buyArticle(userID),
        res,
        status: 200
      })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = ArticleRouter
