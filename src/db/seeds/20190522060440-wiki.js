'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Wikis', [{
      title: "John Doe",
      body: "Famous unknown male person",
      private: false,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: "Jane Doe",
      body: "Famous unknown person",
      private: false,
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()

    }, {
      title: "Bigfoot",
      body: "Famous unknown forest legend",
      private: false,
      userId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('Wikis', null, {});

  }
};
