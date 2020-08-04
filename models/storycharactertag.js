'use strict';
module.exports = (sequelize, DataTypes) => {
  const StoryCharacterTag = sequelize.define('StoryCharacterTag', {
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  StoryCharacterTag.associate = function (models) {
    StoryCharacterTag.belongsTo(models.Story) // add foreignKey: StoryId
    StoryCharacterTag.belongsTo(models.CharacterTag) // add foreignKey: CharacterTagId
  };
  return StoryCharacterTag;
};