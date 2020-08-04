'use strict';
module.exports = (sequelize, DataTypes) => {
  const Story_category = sequelize.define('Story_category', {
    name: DataTypes.STRING,
    status: {type:DataTypes.INTEGER,defaultValue:1,comment:'1-active 0-inactive'}
  }, {});
  Story_category.associate = function(models) {
    Story_category.hasMany(models.Story,{onDelete:'cascade',foreignKey:'StoryCategoryId' ,as:'stories'}); //relation with  story
  };
  return Story_category;
};