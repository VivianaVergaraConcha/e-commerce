const { ArticleModel } = require('../models')

/**
 * It saves a article to the database.
 * @param {Object} article
 * @param {String} article.name
 * @param {Number} article.price
 * @param {String} article.description
 * @param {String} article.owner
 * @returns A promise that resolves to the saved article.
 */
const saveArticle = async article => {
  const savedArticle = new ArticleModel(article)
  await savedArticle.save()

  return savedArticle
}

/**
 * Get a article by its ID.
 * @param {String} id
 * @returns The first article in the array of articles.
 */
const getArticleByID = async id => {
  const articles = await ArticleModel.find({ _id: id })

  return articles[0]
}

/**
 * Update the article.
 * @param {Object} article
 * @param {String} article.id
 * @param {String} article.name
 * @param {Number} article.price
 * @param {String} article.description
 * @param {String} article.owner
 * @returns updated article
 */
const updateOneArticle = async article => {
  const { id, name, price, description, owner } = article
  const articleUpdated = await ArticleModel.findOneAndUpdate(
    { _id: id },
    {
      ...(name && { name }),
      ...(price && { price }),
      ...(description && { description }),
      ...(owner && { owner })
    },
    { new: true }
  )

  return articleUpdated
}

/**
 * Remove the article by id.
 * @param {String} id
 * @returns found article
 */
const removeArticleByID = async id => {
  const article = await ArticleModel.findOneAndRemove({ _id: id })

  return article
}

/**
 * Get the article by owner.
 * @param {String} name
 * @returns A list of article by owner
 */
const getArticleByOwner = async owner => {
  const articles = await ArticleModel.find({ owner })

  return articles
}

/**
 * Remove articles by owner.
 * @param {String} owner
 * @returns number of articles deleted.
 */
const removeArticleByOwner = async owner => {
  const numArticlesDeleted = await ArticleModel.deleteMany({ owner })

  return numArticlesDeleted
}

module.exports = {
  saveArticle,
  getArticleByID,
  updateOneArticle,
  removeArticleByID,
  getArticleByOwner,
  removeArticleByOwner
}
