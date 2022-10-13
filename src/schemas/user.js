const { Type } = require('@sinclair/typebox')

const storeUserSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  lastName: Type.String({ minLength: 2 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
  role: Type.Number(),
  balance: Type.Number({ minimum: 0, default: 0 })
})

const updateUserSchema = Type.Partial(storeUserSchema)

const userIDSchema = Type.Object({
  id: Type.String({ minLength: 24, maxLength: 24 })
})

const userLoginSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({
    minLength: 8
  })
})

const chargeSchema = Type.Object({
  amount: Type.Number({ minimum: 1 })
})

module.exports = {
  storeUserSchema,
  updateUserSchema,
  userIDSchema,
  userLoginSchema,
  chargeSchema
}
