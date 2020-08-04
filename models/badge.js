'use strict';
module.exports = (sequelize, DataTypes) => {
  const Badge = sequelize.define('Badge', {
    name: { type: DataTypes.STRING, allowNull: false },
    icon_url: { type: DataTypes.STRING, allowNull: true },
    points: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
  }, {});
  Badge.associate = function (models) {
    Badge.hasMany(models.UserBadges, { onDelete: 'cascade'})
  };
  return Badge;
};