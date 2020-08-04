'use strict';
module.exports = (sequelize, DataTypes) => {
  const TermConditions = sequelize.define('TermConditions', {
    term_conditions: DataTypes.TEXT,
    version: DataTypes.STRING,
    status: {type:DataTypes.INTEGER,defaultValue:1,'comment':'1-active 0-inactive'}
  }, {});
  TermConditions.associate = function(models) {
    // associations can be defined here
   
  };
  return TermConditions;
};