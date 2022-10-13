const { Type } = require('@sinclair/typebox')

const storeRoleSchema = Type.Object({
  code: Type.Number(),
  name: Type.String({ minLength: 3 })
})

const updateRoleSchema = Type.Partial(storeRoleSchema)

const roleIDSchema = Type.Object({
  id: Type.String({ minLength: 24, maxLength: 24 })
})

module.exports = {
  storeRoleSchema,
  updateRoleSchema,
  roleIDSchema
}
