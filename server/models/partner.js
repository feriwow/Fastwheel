'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const { hashPassword, comparePassword } = require('../helper/bcrypt')
  class Partner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Partner.hasMany(models.Order, { foreignKey: 'partnerId' })
      Partner.hasMany(models.Review, { foreignKey: 'partnerId' })
    }
  }
  Partner.init({
    partnerName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: `Partner name is require`},
        notNull: {msg: `Partner name is invalid`},
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: `Email is require`},
        notNull: {msg: `Email is invalid`},
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: `Password is require`},
        notNull: {msg: `Password is invalid`},
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: `Your phone number is require`},
        notNull: {msg: `Your phone number is invalid`},
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: `Your address is require`},
        notNull: {msg: `Your address is invalid`},
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: `Image url is require`},
        notNull: {msg: `Image url is invalid`},
      }
    },
    location: DataTypes.GEOMETRY('POINT')
  }, {
    sequelize,
    modelName: 'Partner',
  });
  Partner.beforeCreate(async (user, options) => {
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
  });
  return Partner;
};