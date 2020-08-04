'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ac_id: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      avatar_id: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.INTEGER
      },
      charity_id: {
        type: Sequelize.STRING
      },
      subscription_status: {
        type: Sequelize.INTEGER
      },
      last_login_date: {
        type: Sequelize.DATE
      },
      reset_password_date: {
        type: Sequelize.DATE
      },
      notification_enrolled: {
        type: Sequelize.BOOLEAN
      },
      status: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserProfiles');
  }
};