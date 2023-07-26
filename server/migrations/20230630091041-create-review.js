'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
        },
        references: {
          model: "Partners",
          key: "id"
        }
      },
      review: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Reviews');
  }
};