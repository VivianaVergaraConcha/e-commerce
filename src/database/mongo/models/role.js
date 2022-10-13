const { model, Schema } = require('mongoose')

const RoleSchema = new Schema(
  {
    code:{
      require: true,
      type: Number
    },
    name: {
      required: true,
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const RoleModel = model('roles', RoleSchema)

module.exports = RoleModel
