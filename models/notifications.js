'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define('Notifications', {
    title: DataTypes.STRING,
    message: DataTypes.STRING,
    notification_type:DataTypes.STRING,
    profile_name:DataTypes.STRING,
    timezone:DataTypes.STRING,
    status: { type: DataTypes.INTEGER, defaultValue: 0,comment:'0-not sent 1-sent' }
  }, {});
  Notifications.associate = function(models) {
    // associations can be defined here
    Notifications.belongsTo(models.Account) //account id foreign key
    Notifications.belongsTo(models.UserProfile)
 
  };
  return Notifications;
};