'use strict';
module.exports = (sequelize, DataTypes) => {
  const StoryPages = sequelize.define('StoryPages', {
    page_content: DataTypes.TEXT,
    page_image: DataTypes.STRING,
    page_number: DataTypes.INTEGER,
    audio_url: DataTypes.STRING,
    ipad_image:{type:DataTypes.STRING,allowNull:true},
    tablet_image:{type:DataTypes.STRING,allowNull:true},
    status: {type:DataTypes.INTEGER,defaultValue:1,comment:'1-active,0-inactive'}
  }, {});
  StoryPages.associate = function(models) {
    // associations can be defined here
    StoryPages.hasMany(models.Read_stories,{onDelete:'cascade'})
    StoryPages.belongsTo(models.Story)
  };
  return StoryPages;
};