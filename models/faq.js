'use strict';
module.exports = (sequelize, DataTypes) => {
  const Faq = sequelize.define('Faq', {
    faq_section:{type:DataTypes.STRING,allowNull:true},
    faq_questions: { type: DataTypes.TEXT, allowNull: true },
    faq_answers: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  Faq.associate = function (models) {
    // associations can be defined here
  };
  return Faq;
};