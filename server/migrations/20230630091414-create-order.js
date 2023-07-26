'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      problem: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: `problem is require` },
          notNull: { msg: `problem is invalid` },
        }
      },
      location: {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        }
      },
      totalPrice: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      paymentStatus: {
        type: Sequelize.STRING
      },
      car: {
        type: Sequelize.STRING,
        allowNull: false,
      validate: {
        notEmpty: { msg: `Car is require` },
        notNull: { msg: `Car is invalid` },
      }
      },
      carType: {
        type: Sequelize.STRING,
        allowNull: false,
      validate: {
        notEmpty: { msg: `carType is require` },
        notNull: { msg: `carType is invalid` },
      }
      },
      license: {
        type: Sequelize.STRING,
        allowNull: false,
      validate: {
        notEmpty: { msg: `license is require` },
        notNull: { msg: `license is invalid` },
      }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        },
        references: {
          model: "Users",
          key: "id"
        }
      },
      partnerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Partners",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};