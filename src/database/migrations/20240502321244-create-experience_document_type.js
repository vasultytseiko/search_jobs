'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('node:crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('experience_document_type', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert('experience_document_type', [
      {
        id: crypto.randomUUID(),
        name: 'Qualification / License',
      },
      {
        id: crypto.randomUUID(),
        name: 'Employment Contract',
      },
      {
        id: crypto.randomUUID(),
        name: 'Payslip',
      },
      {
        id: crypto.randomUUID(),
        name: 'P60',
      },
    ]);

    await queryInterface.sequelize.query(
      `alter table "experience_document_type" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('experience_document_type');
  },
};
