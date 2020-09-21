const { Review, Product, User } = require("../db");
const { getOne: getUser } = require("./users");
const { getOne: getProduct } = require("./products");

const getAll = ({ idUser, idProduct }) => {
  return new Promise((resolve, reject) => {
    let where = {};

    if (idUser) where.userId = idUser;
    if (idProduct) where.productId = idProduct;

    Review.findAll({
      where,
      order: [["id", "ASC"]],
      include: [Product, User],
    })
      .then((reviews) => {
        if (reviews.length === 0) {
          return reject({
            error: {
              name: "ApiFindError",
              type: "Reviws error",
              errors: [
                {
                  message: "there are no reviews in the database",
                  type: "not found",
                  value: null,
                },
              ],
            },
          });
        }

        resolve(reviews);
      })
      .catch((err) => reject({ error: err }));
  });
};

const createOne = ({ stars, title, description }) => {
  return new Promise((resolve, reject) => {
    Review.create({ stars, title, description })
      .then((review) => resolve(review))
      .catch((err) => reject({ error: err }));
  });
};

const getOne = (id) => {
  return new Promise((resolve, reject) => {
    Review.findOne({
      where: { id },
      include: [Product, User],
    })
      .then((review) => {
        if (!review) {
          return reject({
            error: {
              name: "ApiFindError",
              type: "Reviews Error",
              errors: [
                {
                  message: "Review does not exist in the database",
                  type: "not found",
                  value: null,
                },
              ],
            },
          });
        }

        resolve(review);
      })
      .catch((err) => reject({ error: err }));
  });
};

const editOne = ({ id, stars, title, description }) => {
  return new Promise((resolve, reject) => {
    getOne(id)
      .then((review) => {
        if (stars) review.stars = stars;
        if (title) review.title = title;
        if (description) review.description = description;

        return review.save();
      })
      .then((review) => resolve(review))
      .catch((err) => reject({ error: err }));
  });
};

const deleteOne = (id) => {
  return new Promise((resolve, reject) => {
    getOne(id)
      .then((review) => review.destroy())
      .then(() => resolve({ description: "successfully remove" }))
      .catch((err) => reject({ error: err }));
  });
};

const createReviewComplete = async ({
  idProduct,
  idUser,
  stars,
  title,
  description,
  idReview,
}) => {
  let review = null;

  let product,
    user,
    promises = [];

  if (idUser) {
    user = await getUser(idUser);
  }

  if (idProduct) {
    user = await getUser(idUser);
    product = await getProduct(idProduct);
  }

  if (user && product) {
    const reviesofUser = await user.getReviews();
    const review = reviesofUser.find(
      (review) => review.productId === product.id
    );
    if (review) {
      return new Promise((resolve, reject) => {
        reject({ error: { message: "Error, no creada" } });
      });
    }
  }

  if (!idReview) {
    review = await createOne({ stars, title, description });
  } else {
    review = await getOne(idReview);
  }

  if (idProduct) {
    promises.push(review.setProduct(product));
  }
  if (idUser) {
    promises.push(review.setUser(user));
  }

  if (idProduct || idUser) {
    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then((res) => resolve(res[0]))
        .catch((err) => reject({ error: err }));
    });
  }

  return new Promise((resolve, reject) => {
    if (review) resolve(review);
    else reject({ error: { message: "Error, no creada" } });
  });
};

module.exports = {
  getAll,
  createOne,
  getOne,
  editOne,
  deleteOne,
  createReviewComplete,
};
