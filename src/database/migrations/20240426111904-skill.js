'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('skill', {
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
      `alter table "skill" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('skill');
  },
};
