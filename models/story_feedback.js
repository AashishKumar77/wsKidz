'use strict';
module.exports = (sequelize, DataTypes) => {
  const Story_feedback = sequelize.define('Story_feedback', {
    feedback_text: DataTypes.STRING,
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  Story_feedback.associate = function(models) {
    // associations can be defined here
    // Story_feedback.belongsTo(models.User) //user id foriegn key
    // Story_feedback.belongsTo(models.ChildProfile) // Child id foreign key
    // Story_feedback.belongsTo(models.Story)
  };
  return Story_feedback;
};