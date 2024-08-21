'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },

      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },

      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },

      postcode: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      postcode_latitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      postcode_longitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      auth_user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'auth_user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'role',
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
      `alter table "user" enable row level security;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user');
  },
};
