'use strict';
module.exports = (sequelize, DataTypes) => {
  const Charity = sequelize.define('Charity', {
    // charity_id: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, allowNull: true },
    short_description: { type: DataTypes.TEXT, allowNull: true },
    long_description: { type: DataTypes.TEXT, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  Charity.associate = function (models) {
    // Charity.hasMany(models.Account, { onDelete: 'cascade' })
   
  };
  return Charity;
};
