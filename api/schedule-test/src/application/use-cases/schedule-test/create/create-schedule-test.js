const validate = require("./create-request");

const createScheduleTest = async (repositories, params) => {
  const { scheduleTestRepository } = repositories;

  const { courseId, sessionId, date, startTime, endTime, type, desc } = params;

  // validator
  validate(params);

  const duration = Math.abs(endTime - startTime) / 1000 / 60; // duration = minute

  return scheduleTestRepository.createSchedule({
    courseId,
    sessionId,
    date,
    startTime: startTime.toLocaleTimeString(),
    endTime: endTime.toLocaleTimeString(),
    duration,
    type,
    desc,
  });
};

module.exports = createScheduleTest;
