const config = require("../../../../config/config");
const exchange = config.rabbitmq.scheduleTestExchange;

const createQueueScheduleTest = async (repositories, schedules, cb) => {
  const { rabbitMqRepository } = repositories;
  let index = 0;
  for (const schedule of schedules) {
    const scheduleTime = new Date(`${schedule.date} ${schedule.startTime}`);
    const now = new Date();
    const delay = scheduleTime - now - 5 * 60 * 1000;

    const rabbitParams = {
      scheduleId: Number(schedule.id),
      courseId: Number(schedule.courseId),
    };
    const { classroomId, batchId } = cb[index];
    if (classroomId) rabbitParams.classroomId = classroomId;
    if (batchId) rabbitParams.batchId = batchId;

    await rabbitMqRepository.publishUniqueQueue(
      "ba.schedule.test:create",
      exchange,
      rabbitParams,
      delay,
      `ba_schedule_test_create:${schedule.id}`
    );
    // await rabbitMqRepository.subscribeUniqueQueue(
    //   "ba.schedule.test:create",
    //   exchange
    // );

    index++;
  }
};

module.exports = createQueueScheduleTest;
