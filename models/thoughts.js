'use strict';
module.exports = (sequelize, DataTypes) => {
  const Thoughts = sequelize.define('Thoughts', {
    thought: DataTypes.STRING,
    status: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {});
  Thoughts.associate = function(models) {
    // associations can be defined here
  };
  return Thoughts;
};