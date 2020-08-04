'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Admins', [{
      name: 'Aashish Kumar',
      phone: '9000000323',
      email: 'betterworldllc21@gmail.com',
      password: '$2a$10$RVegukyblEma/JhMLasWou4pG6HelSIPMo3zWph7GW19UHU5rPaw2',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Admins', [{
      name: 'Aashish'
    }])
  }
};
