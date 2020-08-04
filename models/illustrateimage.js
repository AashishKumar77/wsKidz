'use strict';
module.exports = (sequelize, DataTypes) => {
  const IllustrateImage = sequelize.define('IllustrateImage', {
    image: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  IllustrateImage.associate = function (models) {
    IllustrateImage.belongsTo(models.Story) // add foreignKey: StoryId
  };
  return IllustrateImage;
};
