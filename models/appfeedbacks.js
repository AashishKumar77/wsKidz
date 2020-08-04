'use strict';
module.exports = (sequelize, DataTypes) => {
  const AppFeedbacks = sequelize.define('AppFeedbacks', {
    feedback: DataTypes.TEXT,
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  AppFeedbacks.associate = function(models) {
    // associations can be defined here
    AppFeedbacks.belongsTo(models.Account) //user if foreign key
  };
  return AppFeedbacks;
};