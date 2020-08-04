'use strict';
module.exports = (sequelize, DataTypes) => {
  const ContactUs = sequelize.define('ContactUs', {
   
    subject: DataTypes.STRING,
    message: DataTypes.TEXT,
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  ContactUs.associate = function(models) {
    // associations can be defined here
    ContactUs.belongsTo(models.Account) //user if foreign key
  };
  return ContactUs;
};