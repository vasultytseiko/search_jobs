'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('node:crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('personal_document_type', {
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

    await queryInterface.bulkInsert('personal_document_type', [
      {
        id: crypto.randomUUID(),
        name: 'ID Card',
      },
      {
        id: crypto.randomUUID(),
        name: 'Driving License',
      },
      {
        id: crypto.randomUUID(),
        name: 'Passport',
      },
      {
        id: crypto.randomUUID(),
        name: 'Birth Certificate',
      },
    ]);

    await queryInterface.sequelize.query(
      `alter table "personal_document_type" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('personal_document_type');
  },
};
