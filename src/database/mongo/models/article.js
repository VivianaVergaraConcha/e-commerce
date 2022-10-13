const { model, Schema } = require('mongoose')

const ArticleSchema = new Schema(
  {
    name: {
      required: true,
      type: String
    },
    price: {
      required: true,
      type: Number
    },
    description: {
      type: String
    },
    owner: {
      required: true,
      type: Schema.Types.ObjectId
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const ArticleModel = model('article', ArticleSchema)

module.exports = ArticleModel
