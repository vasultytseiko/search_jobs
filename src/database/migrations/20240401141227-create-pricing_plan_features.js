'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pricing_plan_feature_map', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },

      pricing_plan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pricing_plan',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      pricing_plan_feature_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pricing_plan_feature',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.sequelize.query(
      `alter table "pricing_plan_feature_map" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pricing_plan_feature_map');
  },
};
