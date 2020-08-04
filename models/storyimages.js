'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoryImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StoryImages.belongsTo(models.Story)
    }
  };
  StoryImages.init({
    count:DataTypes.STRING,
    image: DataTypes.STRING,
    ipad_image: DataTypes.STRING,
    tablet_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StoryImages',
  });
  return StoryImages;
};