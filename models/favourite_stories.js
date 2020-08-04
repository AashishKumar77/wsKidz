'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favourite_stories = sequelize.define('Favourite_stories', {
    status:{ type: DataTypes.INTEGER, defaultValue: 1,comment:'1 active 0 inactive' }
  }, {});
  Favourite_stories.associate = function(models) {
      // Favourite_stories.belongsTo(models.User) //foreign Key parent id
      Favourite_stories.belongsTo(models.UserProfile) //foreign key profile id
      Favourite_stories.belongsTo(models.Story)
  };
  return Favourite_stories;
};