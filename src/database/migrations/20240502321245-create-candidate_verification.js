'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('candidate_verification', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      personal_document_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      personal_document_type_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'personal_document_type',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      personal_document_status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: true,
      },

      experience_document_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      experience_document_type_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'experience_document_type',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      experience_document_status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.sequelize.query(
      `alter table "candidate_verification" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('candidate_verification');
  },
};
