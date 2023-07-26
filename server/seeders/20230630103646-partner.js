'use strict';
const bcryptjs = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const partners = require('../db/partner.json')
    partners.forEach(el => {
      el.password = bcryptjs.hashSync(el.password)
      el.location = Sequelize.fn(
        'ST_GeomFromText',
        `POINT(${el.location.lng} ${el.location.lat})`
      ),
      el.createdAt = el.updatedAt = new Date()
    })
    await queryInterface.bulkInsert("Partners", partners, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    */
    await queryInterface.bulkDelete('Partners', null, {});
  }
};
