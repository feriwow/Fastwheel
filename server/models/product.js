'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.OrderDetail, { foreignKey: 'productId' })
      Product.belongsToMany(models.Order, {through: models.OrderDetail, foreignKey:"productId"})
    }
  }
  Product.init({
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: `Product name is require`},
        notNull: {msg: `Product name is invalid`},
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: `Product type is require`},
        notNull: {msg: `Product type is invalid`},
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {msg: `Price is require`},
        notNull: {msg: `Price is invalid`},
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: `Image is require`},
        notNull: {msg: `Image is invalid`},
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};