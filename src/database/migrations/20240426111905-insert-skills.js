'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('skill', [
      {
        id: crypto.randomUUID(),
        value: 'Time Management',
      },
      {
        id: crypto.randomUUID(),
        value: 'Responsibility',
      },
      {
        id: crypto.randomUUID(),
        value: 'Hardworking',
      },
      {
        id: crypto.randomUUID(),
        value: 'Assertiveness',
      },
      {
        id: crypto.randomUUID(),
        value: 'Latte Art',
      },
      {
        id: crypto.randomUUID(),
        value: 'Cash Handling',
      },
      {
        id: crypto.randomUUID(),
        value: 'Problem-solving',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('skill', null, {});
  },
};
