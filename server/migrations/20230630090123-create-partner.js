'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Partners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      partnerName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        }
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
          notNull: true,
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
          min: 5
        }
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        }
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        }
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        }
      },
      location: {
        type: Sequelize.GEOMETRY('POINT')
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
    await queryInterface.dropTable('Partners');
  }
};