'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('candidate_data', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },

      sector_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sector',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      hospitality_first_role_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'hospitality_role',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      hospitality_second_role_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'hospitality_role',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      hospitality_main_establishment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'hospitality_establishment',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      hospitality_second_establishment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'hospitality_establishment',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      construction_role_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'construction_role',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      construction_card_type_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'construction_card_type',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      years_experience_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'years_experience',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      daily_job_update_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'daily_job_update',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      agreement_to_contact: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.sequelize.query(
      `alter table "candidate_data" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('candidate_data');
  },
};
