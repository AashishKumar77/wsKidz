'use strict';
module.exports = (sequelize, DataTypes) => {
  const ForceUpdate = sequelize.define('ForceUpdate', {
    app_version: DataTypes.STRING,
    force_upgrade: {type:DataTypes.BOOLEAN,defaultValue:false}
  }, {});
  ForceUpdate.associate = function(models) {
    // associations can be defined here
  };
  return ForceUpdate;
};