"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("questions", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      questionServedId: {
        type: Sequelize.BIGINT,
        references: { model: { tableName: "questionServeds" }, key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      questionId: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      // createdAt: { type: Sequelize.DATE, allowNull: true },
      // updatedAt: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("questions");
  },
};
