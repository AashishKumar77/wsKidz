'use strict';
module.exports = (sequelize, DataTypes) => {
  const Read_stories = sequelize.define('Read_stories', {
    liked:{type:DataTypes.BOOLEAN, defaultValue: false},
    feedback_text: DataTypes.TEXT,
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  Read_stories.associate = function(models) {
 
    Read_stories.belongsTo(models.UserProfile) // foreign key  profile id
    Read_stories.belongsTo(models.Story) //foerign key story id
    Read_stories.belongsTo(models.StoryPages) // foreign key story page id
  };
  return Read_stories;
};