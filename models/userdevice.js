'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserDevice = sequelize.define('UserDevice', {
    app_id: DataTypes.STRING,
    os_type: {type:DataTypes.STRING,comment:'0-ios 1-android'},
    os_version:{type:DataTypes.STRING},
    device_model: DataTypes.STRING,
    app_version: DataTypes.STRING,
    device_token: DataTypes.STRING,
    auth_token: DataTypes.TEXT,
    locale:DataTypes.STRING,
    notification_enrolled: {type:DataTypes.INTEGER,defaultValue:0,comment:'1-active 0-inactive'},
    status: {type:DataTypes.INTEGER,defaultValue:1,comment:'1-active 0-inactive'}
  }, {});
  UserDevice.associate = function(models) {
    // associations can be defined here
    UserDevice.belongsTo(models.Account) //foreign key account id
  };
  return UserDevice;
};