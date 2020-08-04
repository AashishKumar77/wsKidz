'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserEarnedPoints = sequelize.define('UserEarnedPoints', {
    Points: DataTypes.INTEGER,
    Point_for: {type:DataTypes.INTEGER,comment:'0-story 1-question'}
  }, {});
  UserEarnedPoints.associate = function(models) {
    UserEarnedPoints.belongsTo(models.UserProfile) // foreign key profile id
    UserEarnedPoints.belongsTo(models.Story) // foreign key story id
  };
  return UserEarnedPoints;
};