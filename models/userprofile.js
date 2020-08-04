'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('UserProfile', {
    account_type:{type:DataTypes.INTEGER,comment:'1-parent 0-child'},
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    avatar_id: DataTypes.STRING,
    points:{type: DataTypes.BIGINT,defaultValue:0},
    audio_mode:{type: DataTypes.BOOLEAN,defaultValue:false},
    landscape_mode:{type:DataTypes.BOOLEAN,defaultValue:false} ,
    status: {type:DataTypes.INTEGER,defaultValue:1,comment:'1-active 0-notactive'}
  }, {});
  UserProfile.associate = function(models) {
    // associations can be defined here
    UserProfile.belongsTo(models.Account) // foreign key accountid
    UserProfile.hasMany(models.Favourite_stories,{onDelete:'cascade',foreignKey:'UserProfileId',as:'favourite_stories'})
    UserProfile.hasMany(models.Read_stories,{onDelete:'cascade',foreignKey:'UserProfileId',as:'read_stories'})
    UserProfile.hasMany(models.UserBadges,{onDelete:'cascade',foreignKey:'UserProfileId',as:'user_badges'})
    UserProfile.hasMany(models.UserEarnedPoints,{onDelete:'cascade',foreignKey:"UserProfileId",as:'user_earned_points'})
    UserProfile.hasMany(models.ProfileValue,{onDelete:'cascade',foreignKey:"UserProfileId",as:'profile_values'})
    UserProfile.hasMany(models.Notifications,{onDelete:'cascade'})
  };
  return UserProfile;
};