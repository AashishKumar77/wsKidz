'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAcceptedTerms = sequelize.define('UserAcceptedTerms', {
    app_version: DataTypes.STRING,
    os_type: DataTypes.INTEGER,
    terms_version: DataTypes.STRING,
  }, {});
  UserAcceptedTerms.associate = function(models) {
    // associations can be defined here
    UserAcceptedTerms.belongsTo(models.Account) // foriegn key account id
  };
  return UserAcceptedTerms;
};