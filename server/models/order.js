'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Partner, { foreignKey: 'partnerId' })
      Order.belongsTo(models.User, { foreignKey: 'userId' })
      Order.hasMany(models.OrderDetail, { foreignKey: 'orderId' })
      Order.belongsToMany(models.Product, {through:models.OrderDetail, foreignKey: "orderId"})
    }
  }
  Order.init({
    problem: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: { msg: `Problem is require` },
        notNull: { msg: `Problem is invalid` },
      }
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
      validate: {
        notEmpty: { msg: `Location is require` },
        notNull: { msg: `Location is invalid` },
      }
    },
    totalPrice: DataTypes.INTEGER,
    status: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    car:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: { msg: `Car is require` },
        notNull: { msg: `Car is invalid` },
      }
    },
    carType:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: { msg: `car Type is require` },
        notNull: { msg: `car Type is invalid` },
      }
    },
    license:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: { msg: `license is require` },
        notNull: { msg: `license is invalid` },
      }
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: `User id is require` },
        notNull: { msg: `User id is invalid` },
      }
    },
    partnerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};