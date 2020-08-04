'use strict';
module.exports = (sequelize, DataTypes) => {
  const StoryValueTag = sequelize.define('StoryValueTag', {
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  StoryValueTag.associate = function (models) {
    StoryValueTag.belongsTo(models.Story) // add foreignKey: StoryId
    StoryValueTag.belongsTo(models.ValueTag) // add foreignKey: ValueTagId
  };
  return StoryValueTag;
};