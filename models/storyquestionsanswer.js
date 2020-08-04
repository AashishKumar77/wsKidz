'use strict';
module.exports = (sequelize, DataTypes) => {
  const StoryQuestionsAnswer = sequelize.define('StoryQuestionsAnswer', {
    answer_text: DataTypes.TEXT,
    answer_status: DataTypes.BOOLEAN,
    status: {type:DataTypes.INTEGER,defaultValue:1,comment:'1-active,0-inactive'}
  }, {});
  StoryQuestionsAnswer.associate = function(models) {
    // associations can be defined here
    StoryQuestionsAnswer.belongsTo(models.StoryQuestions) //foreign key question_id
  };
  return StoryQuestionsAnswer;
};