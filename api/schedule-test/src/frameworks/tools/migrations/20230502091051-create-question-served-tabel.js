"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("questionServeds", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      scheduleId: {
        type: Sequelize.BIGINT,
        references: { model: { tableName: "schedule-tests" }, key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      formId: {
        type: Sequelize.BIGINT,
        references: { model: { tableName: "forms" }, key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      duration: { type: Sequelize.INTEGER, allowNull: true },
      randomize: { type: Sequelize.BOOLEAN, allowNull: false },
      levelDifficult: { type: Sequelize.INTEGER, allowNull: true },
      amount: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: true },
      updatedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("questionServeds");
  },
};
