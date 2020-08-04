'use strict';
module.exports = (sequelize, DataTypes) => {
  const ValueTag = sequelize.define('ValueTag', {
    name: { type: DataTypes.STRING, allowNull: false },
    keywords: { type: DataTypes.TEXT, allowNull: false },
    icon_url: { type: DataTypes.STRING, allowNull: true },
    color: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  ValueTag.associate = function (models) {
    // associations can be defined here
    ValueTag.hasMany(models.ProfileValue, { onDelete: 'cascade', foreignKey: 'ValueTagId', as: 'tags' })
    ValueTag.hasMany(models.StoryValueTag)
  };
  return ValueTag;
};
