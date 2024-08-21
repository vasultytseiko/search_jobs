'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('node:crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      role: {
        type: Sequelize.STRING,
      },

      role_desc: {
        type: Sequelize.STRING,
      },
    });

    await queryInterface.bulkInsert('role', [
      {
        id: crypto.randomUUID(),
        role: 'candidate',
        role_desc: 'User can apply to jobs and create a profile.',
      },
      {
        id: crypto.randomUUID(),
        role: 'recruiter',
        role_desc:
          'User can create jobs, SMS campaigns and search for candidates.',
      },
      {
        id: crypto.randomUUID(),
        role: 'admin',
        role_desc: 'User can manage users, roles and permissions.',
      },
    ]);

    await queryInterface.sequelize.query(
      `alter table "role" enable row level security;`,
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable('role');
  },
};
