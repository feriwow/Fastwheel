const {
  User,
  Partner,
  Order,
  OrderDetail,
  Product,
  Review,
  Sequelize,
} = require("../models");
const { hashPassword } = require("./bcrypt");
const product = require("../db/product.json");
const order = require("../db/order.json");
const user = require("../db/user.json")


async function bulkInsertCust() {
  try {
    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Order.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await OrderDetail.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Product.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    // Review.destroy({
    //     truncate: true,
    //     restartIdentity: true,
    //     cascade: true
    // })

    // product.forEach((el) => {
    //     Product.create(el)
    // })

    await Product.bulkCreate(product);

    
    user.forEach((el) => {
      el.password = hashPassword(el.password);
  })

  await User.bulkCreate(user)

    order.forEach((el) => {
      el.location = Sequelize.fn(
        "ST_GeomFromText",
        `POINT(${el.location.lng} ${el.location.lat})`
      );
    });
    await Order.bulkCreate(order)


    return await User.create({
      username: "deaimut",
      email: "deacantik@gmail.com",
      password: "inidea",
      phoneNumber: "081122333",
    });

  } catch (err) {
    console.log(err, "<======");
    throw err;
  }
}

module.exports = bulkInsertCust;
