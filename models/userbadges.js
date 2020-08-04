'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserBadges = sequelize.define('UserBadges', {
    // parent_id: DataTypes.INTEGER
  }, {});
  UserBadges.associate = function(models) {
    UserBadges.belongsTo(models.UserProfile) // foreign key profile id
    UserBadges.belongsTo(models.Badge,{foreignKey:'BadgeId',as:'badges'}) //foreign key badge_id
  };
  return UserBadges;
};