const getAllScheduleTest = require("./get/get-all-schedule-test");
const getScheduleTestById = require("./get/find-by-id-schedule-test");
const createScheduleTest = require("./create/create-schedule-test");
const bulkCreateScheduleTest = require("./create/bulk-create-schedule-test");
const createQueueScheduleTest = require("./create/create-queue-schedule-test");
const createQueueRegistration = require("./create/create-queue-registration");
const updateScheduleTest = require("./update/update-schedule");
const updateTokenScheduleTest = require("./update/update-token-schedule-test");
const deleteBySessionIdScheduleTest = require("./delete/delete-by-session-id-schedule-test");
const deleteQueueScheduleTest = require("./delete/delete-queue-schedule-test");
const deleteQueueRegistration = require("./delete/delete-queue-registration");
const exportAllScheduleTest = require("./export/export-all-schedule");
const exportScheduleTestById = require("./export/export-by-id-schedule");
const sessionTrigger = require("./session-trigger");
const assignSchedule = require("./assign-schedule");
const guardScheduleAssign = require("./guard-schedule-assign");
const republishSchedule = require("./republish-schedule");

module.exports = (repositories) => {
  return {
    getAllScheduleTest: getAllScheduleTest.bind(null, repositories),
    getScheduleTestById: getScheduleTestById.bind(null, repositories),
    createScheduleTest: createScheduleTest.bind(null, repositories),
    bulkCreateScheduleTest: bulkCreateScheduleTest.bind(null, repositories),
    createQueueScheduleTest: createQueueScheduleTest.bind(null, repositories),
    createQueueRegistration: createQueueRegistration.bind(null, repositories),
    updateScheduleTest: updateScheduleTest.bind(null, repositories),
    updateTokenScheduleTest: updateTokenScheduleTest.bind(null, repositories),
    deleteBySessionIdScheduleTest: deleteBySessionIdScheduleTest.bind(
      null,
      repositories,
    ),
    deleteQueueScheduleTest: deleteQueueScheduleTest.bind(null, repositories),
    deleteQueueRegistration: deleteQueueRegistration.bind(null, repositories),
    exportAllScheduleTest: exportAllScheduleTest.bind(null, repositories),
    exportScheduleTestById: exportScheduleTestById.bind(null, repositories),
    sessionTrigger: sessionTrigger.bind(null, repositories),
    assignSchedule: assignSchedule.bind(null, repositories),
    guardScheduleAssign: guardScheduleAssign.bind(null, repositories),
    republishSchedule: republishSchedule.bind(null, repositories),
  };
};
