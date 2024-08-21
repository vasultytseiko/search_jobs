'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sms_campaign_filter', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
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

      postcode: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      distance: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },

      verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });

    await queryInterface.sequelize.query(
      `alter table "sms_campaign_filter" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sms_campaign_filter');
  },
};
