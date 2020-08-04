'use strict';
module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define('Story', {
    // story_id: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
    title: { type: DataTypes.STRING, allowNull: true },
    video_url: { type: DataTypes.STRING, allowNull: true },
    audio_flag: { type: DataTypes.BOOLEAN, defaultValue: false },
    synopsis_audio_url: { type: DataTypes.STRING, allowNull: true },
    text:{type:DataTypes.TEXT,allowNull:true},
    story_audio_url:{type:DataTypes.STRING,allowNull:true},
    search_keywords: { type: DataTypes.TEXT, defaultValue: false },
    button_color: { type: DataTypes.STRING, allowNull: true },
    points: { type: DataTypes.INTEGER, allowNull: true },
    catalogue_image: { type: DataTypes.STRING, allowNull: true },
    synopsis_content: { type: DataTypes.TEXT, allowNull: true },
    synopsis_image: { type: DataTypes.STRING, allowNull: true },
    ipad_image:{type:DataTypes.STRING,allowNull:true},
    tablet_image:{type:DataTypes.STRING,allowNull:true},
    locked: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
  }, {});
  Story.associate = function (models) {
    Story.belongsTo(models.Admin) // add foreignKey: AdminId
    Story.belongsTo(models.Story_category) // add foreign key: storycategoryId
    Story.hasMany(models.IllustrateImage, { onDelete: 'cascade' })
    Story.hasMany(models.Favourite_stories, { onDelete: 'cascade' })
    Story.hasMany(models.Read_stories, { onDelete: 'cascade' })
    Story.hasMany(models.Story_feedback, { onDelete: 'cascade' })
    Story.hasMany(models.StoryQuestions, { onDelete: 'cascade' })
    Story.hasMany(models.StoryPages, { onDelete: 'cascade' })
    Story.hasMany(models.StoryValueTag, { onDelete: 'cascade' })
    Story.hasMany(models.StoryCharacterTag, { onDelete: 'cascade' })
    Story.hasMany(models.UserEarnedPoints, { onDelete: 'cascade' })
    Story.hasMany(models.StoryImages,{onDelete:'cascade'})
  };
  return Story;
};
