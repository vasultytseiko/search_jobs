'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('candidate_skill', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      skill_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'skill',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });

    await queryInterface.sequelize.query(
      `alter table "candidate_skill" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('candidate_skill');
  },
};
