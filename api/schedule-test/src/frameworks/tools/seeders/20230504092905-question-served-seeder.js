"use strict";

const _ = require("lodash");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // let questionServed = [];
    // const total = 5;
    // for (let i = 1; i <= total; i++) {
    //   questionServed.push({
    //     scheduleId: 1,
    //     formId: _.sample([1, 2, 3, 4, 5]),
    //     duration: _.sample([30, 60, 90, 120, 150, 180]),
    //     randomize: _.sample([true, false]),
    //     levelDifficult: _.sample([1, 2, 3, 4, 5]),
    //     amount: _.random(5, 20),
    //   });
    // }
    //
    // await queryInterface.bulkInsert("questionServed", questionServed);
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.bulkDelete("questionServed", null);
  },
};
