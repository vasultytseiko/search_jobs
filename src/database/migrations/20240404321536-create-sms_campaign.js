'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sms_campaign', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      credits_spent: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      amount_of_candidates: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION',
      },

      // If the campaign was created by job_id, then it will be linked to a job.
      job_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'job',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION',
      },

      // If the campaign was created by filter_id, then it will be linked to a filter.
      sms_campaign_filter_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'sms_campaign_filter',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      last_sent_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.sequelize.query(
      `alter table "sms_campaign" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sms_campaign');
  },
};
