'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('node:crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('pricing_plan', [
      {
        id: crypto.randomUUID(),
        name: 'Free',
        value: 'free',
        description:
          'For those just getting started or wanting to trial the platform.',
        price: 0,
        price_per_credit: 0.09,
        credits_included: 250,
      },
      {
        id: crypto.randomUUID(),
        name: 'Small Crew',
        value: 'small_crew',
        description: 'The best option for small team with irregular vacancies.',
        price: 49.99,
        price_per_credit: 0.08,
        credits_included: 500,
      },
      {
        id: crypto.randomUUID(),
        name: 'Medium Crew',
        value: 'medium_crew',
        description: 'The best option for small team with irregular vacancies.',
        price: 99.99,
        price_per_credit: 0.06,
        credits_included: 1000,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('pricing_plan', null, {});
  },
};
