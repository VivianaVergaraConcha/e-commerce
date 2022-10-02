const { Type } = require("@sinclair/typebox");

const storeRoleSchema = Type.Object({
  name: Type.String({ minLength: 5 }),
});

const updateRoleSchema = Type.Partial(storeRoleSchema);

const roleIDSchema = Type.Object({
  id: Type.String({ minLength: 21, maxLength: 21 }),
});

module.exports = {
  storeRoleSchema,
  updateRoleSchema,
  roleIDSchema,
};
