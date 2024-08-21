'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('billing', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      customer_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      subscription_id: {
        type: Sequelize.STRING,
        allowNull: true,
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
        onDelete: 'CASCADE',
      },

      payment_method_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'payment_method',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      credits: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      pricing_plan_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pricing_plan',
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
      `alter table "billing" enable row level security;`,
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable('billing');
  },
};
