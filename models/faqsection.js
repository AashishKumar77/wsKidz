'use strict';
module.exports = (sequelize, DataTypes) => {
  const FaqSection = sequelize.define('FaqSection', {
    // charity_id: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  FaqSection.associate = function (models) {
    // Charity.hasMany(models.Account, { onDelete: 'cascade' })
   
  };
  return FaqSection;
};
