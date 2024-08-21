'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sector', {
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
      `alter table "sector" enable row level security;`,
    );

    await queryInterface.createTable('hospitality_role', {
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

      group: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.sequelize.query(
      `alter table "hospitality_role" enable row level security;`,
    );

    await queryInterface.createTable('hospitality_establishment', {
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
      `alter table "hospitality_establishment" enable row level security;`,
    );

    await queryInterface.createTable('construction_role', {
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
      `alter table "construction_role" enable row level security;`,
    );

    await queryInterface.createTable('construction_card_type', {
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
      `alter table "construction_card_type" enable row level security;`,
    );

    await queryInterface.createTable('years_experience', {
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
      `alter table "years_experience" enable row level security;`,
    );

    await queryInterface.createTable('daily_job_update', {
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
      `alter table "daily_job_update" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('hospitality_role');
    await queryInterface.dropTable('hospitality_establishment');
    await queryInterface.dropTable('construction_role');
    await queryInterface.dropTable('construction_card_type');
    await queryInterface.dropTable('years_experience');
    await queryInterface.dropTable('daily_job_update');
  },
};
