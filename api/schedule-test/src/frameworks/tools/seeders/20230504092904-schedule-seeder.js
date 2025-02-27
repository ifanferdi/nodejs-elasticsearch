"use strict";

const _ = require("lodash");
const moment = require("moment");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // let schedules = [];
    // const total = 5;
    // const startTime = new Date(new Date());
    // const endTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 10);
    // for (let i = 1; i <= total; i++) {
    //   schedules.push({
    //     courseId: 1,
    //     sessionId: 1,
    //     date: moment(new Date()).format("YYYY-MM-DD"),
    //     startTime: startTime.toLocaleTimeString(),
    //     endTime: endTime.toLocaleTimeString(),
    //     duration: Math.abs(endTime - startTime) / 1000,
    //     type: _.sample(["kuis", "ujian"]),
    //     desc: "Sesi " + i,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   });
    // }
    //
    // await queryInterface.bulkInsert("schedule-test", schedules);
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.bulkDelete("schedule-test", null);
  },
};
