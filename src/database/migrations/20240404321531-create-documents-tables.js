'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('node:crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('document_type', {
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

      group: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert('document_type', [
      {
        id: crypto.randomUUID(),
        value: 'Driving License',
        group: 'Personal',
      },
      {
        id: crypto.randomUUID(),
        value: 'Passport',
        group: 'Personal',
      },
      {
        id: crypto.randomUUID(),
        value: 'Birth Certificate',
        group: 'Personal',
      },
      {
        id: crypto.randomUUID(),
        value: 'ID Card',
        group: 'Personal',
      },
      {
        id: crypto.randomUUID(),
        value: 'Qualification / Licence',
        group: 'Experience',
      },
      {
        id: crypto.randomUUID(),
        value: 'Employment Contract',
        group: 'Experience',
      },
      {
        id: crypto.randomUUID(),
        value: 'Payslip',
        group: 'Experience',
      },
      {
        id: crypto.randomUUID(),
        value: 'P60',
        group: 'Experience',
      },
    ]);

    await queryInterface.sequelize.query(
      `alter table "document_type" enable row level security;`,
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable('document_type');
  },
};
