const { Type } = require('@sinclair/typebox')

const storeArticleSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  price: Type.Number({ minimum: 0 }),
  description: Type.String({ minLength: 2 }),
})

const updateArticleSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  price: Type.Number({ minimum: 0 }),
  description: Type.String({ minLength: 2 }),
  owner: Type.String({ minLength: 24, maxLength: 24 })
})

const articleIDSchema = Type.Object({
  id: Type.String({ minLength: 24, maxLength: 24 })
})

module.exports = {
  storeArticleSchema,
  updateArticleSchema,
  articleIDSchema
}
