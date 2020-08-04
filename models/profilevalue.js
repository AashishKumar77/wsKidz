'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProfileValue = sequelize.define('ProfileValue', {
    point: DataTypes.INTEGER
  }, {});
  ProfileValue.associate = function(models) {
    // associations can be defined here
    ProfileValue.belongsTo(models.UserProfile) //foreign id profile id
    ProfileValue.belongsTo(models.ValueTag,{foreignKey:'ValueTagId',as:'tags'}) //foreign id Value id
  };
  return ProfileValue;
};