'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('job', {
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

      hospitality_role_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'hospitality_role',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      hospitality_establishment_id: {
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
        allowNull: true,
        references: {
          model: 'years_experience',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      employment_type_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'employment_type',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      rate_of_pay: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },

      postcode: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      distance: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },

      status: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'job_status',
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
      `alter table "job" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('job');
  },
};
