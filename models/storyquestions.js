'use strict';
module.exports = (sequelize, DataTypes) => {
  const StoryQuestions = sequelize.define('StoryQuestions', {
    question_text: DataTypes.TEXT,
    question_type: { type: DataTypes.INTEGER, defaultValue: 0, comment: '1-MCQ,2-FREE-TEXT,3-NONE' },
    status: { type: DataTypes.INTEGER, defaultValue: 1, comment: '1-active,0-inactive' }
  }, {});
  StoryQuestions.associate = function (models) {
    // associations can be defined here
    StoryQuestions.belongsTo(models.Story) // foreign key story_id
    StoryQuestions.hasMany(models.StoryQuestionsAnswer, { onDelete: 'cascade', foreignKey: 'StoryQuestionId', as: 'answers' })
  };
  return StoryQuestions;
};