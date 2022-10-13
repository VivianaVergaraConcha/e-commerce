const { model, Schema } = require('mongoose')

const UserSchema = new Schema(
  {
    name: {
      required: true,
      type: String
    },
    lastName: {
      required: true,
      type: String
    },
    email: {
      required: true,
      type: String
    },
    salt: {
      required: true,
      type: String
    },
    hash: {
      required: true,
      type: String
    },
    role: {
      required: true,
      type: Schema.Types.ObjectId
    },
    balance: {
      required: true,
      type: Number
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const UserModel = model('users', UserSchema)

module.exports = UserModel
