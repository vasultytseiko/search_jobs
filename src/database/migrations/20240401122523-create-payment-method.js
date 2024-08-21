'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { randomUUID } = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_method', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      value: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.sequelize.query(
      `alter table "payment_method" enable row level security;`,
    );

    await queryInterface.bulkInsert('payment_method', [
      {
        id: randomUUID(),
        name: 'Stripe',
        value: 'stripe',
        description: 'Stripe payment gateway.',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('payment_method');
  },
};
