'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderDetail.belongsTo(models.Order, { foreignKey: 'orderId' })
      OrderDetail.belongsTo(models.Product, { foreignKey: 'productId' })
    }
  }
  OrderDetail.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notEmpty: { msg: `Order Id is required` },
        notNull: { msg: `Order Id is invalid` },
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notEmpty: { msg: `Product Id is required` },
        notNull: { msg: `Product Id is invalid` },
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notEmpty: { msg: `Quantity is required` },
        notNull: { msg: `Quantity Id is invalid` },
      }
    }
  }, {
    sequelize,
    modelName: 'OrderDetail',
  });
  return OrderDetail;
};