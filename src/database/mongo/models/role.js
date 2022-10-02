const { model, Schema } = require("mongoose");

const RoleSchema = new Schema(
  {
    id: {
      required: true,
      type: String,
      unique: true,
    },
    name: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: {
      transform: (_, ret) => {
        delete ret._id;
      },
    },
  }
);

const RoleModel = model("roles", RoleSchema);

module.exports = RoleModel;
