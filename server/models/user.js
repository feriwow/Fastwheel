'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const { hashPassword, comparePassword } = require('../helper/bcrypt')
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, { foreignKey: 'userId' })
      User.hasMany(models.Review, { foreignKey: 'userId' })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {msg: `username is require`},
        notNull: {msg: `username is invalid`},
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
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(async (user, options) => {
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
  });
  return User;
};