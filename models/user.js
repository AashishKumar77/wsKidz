'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    faq_question: DataTypes.TEXT,
    faq_question_ans: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};