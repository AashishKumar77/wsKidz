'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Stories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // story_id: { type: Sequelize.UUID, allowNull: false, defaultValue: Sequelize.UUIDV4 },
      title: { type: Sequelize.STRING, allowNull: true },
      video_url: { type: Sequelize.STRING, allowNull: true },
      audio_flag: { type: Sequelize.BOOLEAN, defaultValue: false },
      synopsis_audio_url: { type: Sequelize.STRING, allowNull: true },
      search_keywords: { type: Sequelize.TEXT, defaultValue: false },
      button_color: { type: Sequelize.STRING, allowNull: true },
      points: { type: Sequelize.INTEGER, allowNull: true },
      synopsis_image: { type: Sequelize.STRING, allowNull: true },
      catalogue_image: { type: Sequelize.STRING, allowNull: true },
      synopsis_content: { type: Sequelize.TEXT, allowNull: true },
      locked: { type: Sequelize.BOOLEAN, defaultValue: false },
      status: { type: Sequelize.INTEGER, defaultValue: 1 },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Stories');
  }
};
