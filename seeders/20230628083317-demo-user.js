'use strict';
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(12);

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      username: 'admin',
      name: 'Admin',
      password: bcrypt.hashSync("admin", salt),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
