"use strict";

const { faker } = require("@faker-js/faker");
const { sample, uniq } = require("lodash");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let forms = [];
    const total = 5;
    for (let i = 1; i <= total; i++) {
      forms.push({
        file: "form/default.mp4",
        name: faker.lorem.word(),
        questionForm: JSON.stringify(
          uniq(
            Array.from({ length: sample([1, 2, 3]) }, () =>
              sample([1, 2, 3, 4, 5, 6, 7, 8])
            )
          )
        ),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("forms", forms);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("forms", null);
  },
};
