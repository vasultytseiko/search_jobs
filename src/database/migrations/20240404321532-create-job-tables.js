'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('node:crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employment_type', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.sequelize.query(
      `alter table "employment_type" enable row level security;`,
    );

    await queryInterface.createTable('job_status', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.sequelize.query(
      `alter table "job_status" enable row level security;`,
    );

    await queryInterface.bulkInsert('employment_type', [
      { id: crypto.randomUUID(), value: 'Full-time' },
      { id: crypto.randomUUID(), value: 'Part-time' },
    ]);

    await queryInterface.bulkInsert('job_status', [
      { id: crypto.randomUUID(), value: 'Published' },
      { id: crypto.randomUUID(), value: 'Not Published' },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('employment_type');
    await queryInterface.dropTable('job_status');
  },
};
