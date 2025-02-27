const getQuestionByIdScheduleTest = require("./get-question-by-id-schedule-test");

module.exports = (repositories) => {
  return {
    getQuestionByIdScheduleTest: getQuestionByIdScheduleTest.bind(
      null,
      repositories
    ),
  };
};
