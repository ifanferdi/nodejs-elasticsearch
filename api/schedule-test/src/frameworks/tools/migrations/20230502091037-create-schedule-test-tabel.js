"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("schedule-tests", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      batchId: { type: Sequelize.BIGINT, allowNull: false },
      sessionId: { type: Sequelize.BIGINT, allowNull: false, unique: true },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      startTime: { type: Sequelize.TIME, allowNull: false },
      endTime: { type: Sequelize.TIME, allowNull: false },
      duration: { type: Sequelize.INTEGER, allowNull: false },
      type: { type: Sequelize.STRING(50), allowNull: false },
      token: { type: Sequelize.STRING(10), allowNull: true, unique: true },
      desc: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: true },
      updatedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("schedule-tests");
  },
};
