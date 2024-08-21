'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sms_campaign_candidate', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      sms_campaign_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sms_campaign',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      candidate_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.sequelize.query(
      `alter table "sms_campaign_candidate" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sms_campaign_candidate');
  },
};
