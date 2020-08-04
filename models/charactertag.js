'use strict';
module.exports = (sequelize, DataTypes) => {
  const CharacterTag = sequelize.define('CharacterTag', {
    name: { type: DataTypes.STRING, allowNull: false },
    icon_url: { type: DataTypes.STRING, allowNull: true },
    points: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  CharacterTag.associate = function (models) {
    // associate
  };
  return CharacterTag;
};
