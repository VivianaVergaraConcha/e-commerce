const httpErrors = require("http-errors");
const UserService = require("./user");
const {
  mongo: { queries },
} = require("../database");

const {
  article: {
    saveArticle,
    getArticleByID,
    updateOneArticle,
    removeArticleByID,
    getArticleByOwner,
  },
} = queries;

class ArticleService {
  #id;
  #name;
  #price;
  #description;
  #owner;

  /**
   * @param {Object} args
   * @param {String} args.id
   * @param {String} args.name
   * @param {Number} args.price
   * @param {String} args.description
   * @param {String} args.owner
   */
  constructor(args = {}) {
    const {
      id = "",
      name = "",
      price = 0,
      description = "",
      owner = "",
    } = args;

    this.#id = id;
    this.#name = name;
    this.#price = price;
    this.#description = description;
    this.#owner = owner;
  }

  async saveArticle() {
    if (!this.#name)
      throw new httpErrors.BadRequest("Missing required field: name");

    if (!this.#price)
      throw new httpErrors.BadRequest("Missing required field: price");

    if (!this.#owner)
      throw new httpErrors.BadRequest("Missing required field: owner");

    await new UserService({ id: this.#owner }).verifyUserExists();

    return await saveArticle({
      name: this.#name,
      price: this.#price,
      description: this.#description,
      owner: this.#owner,
    });
  }

  async getArticleByID() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    const article = await getArticleByID(this.#id);

    if (!article)
      throw new httpErrors.NotFound("The requested article does not exists");

    return article;
  }

  async updateOneArticle() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    return await updateOneArticle({
      id: this.#id,
      name: this.#name,
      price: this.#price,
      description: this.#description,
      owner: this.#owner,
    });
  }

  async removeArticleByID() {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    const article = await removeArticleByID(this.#id);

    if (!article)
      throw new httpErrors.NotFound("The requested article does not exists");

    return article;
  }

  async getArticleByOwner() {
    if (!this.#owner)
      throw new httpErrors.BadRequest("Missing required field: owner");

    await new UserService({ id: this.#owner }).verifyUserExists();

    const article = await getArticleByOwner(this.#owner);

    if (!article)
      throw new httpErrors.NotFound("The requested article does not exists");

    return article;
  }

  async buyArticle(idUser) {
    if (!this.#id)
      throw new httpErrors.BadRequest("Missing required field: id");

    const article = await getArticleByID(this.#id);
    const client = await new UserService({ id: idUser }).getUserByID();
    const owner = await new UserService({
      id: article.owner,
    }).getUserByID();

    if (client.balance - article.price < 0)
      throw new httpErrors.BadRequest("Insufficient balance");

    await new UserService({
      id: client.id,
      balance: client.balance - article.price,
    }).updateOneUser();
    await new UserService({
      id: owner.id,
      balance: owner.balance + article.price,
    }).updateOneUser();

    return await updateOneArticle({
      id: this.#id,
      owner: client.id,
    });
  }
}

module.exports = ArticleService;
