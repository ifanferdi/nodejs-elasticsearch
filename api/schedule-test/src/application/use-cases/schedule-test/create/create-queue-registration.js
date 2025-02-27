const config = require("../../../../config/config");
const _ = require("lodash");
const registrationExchange = config.rabbitmq.registrationExchange;

const createQueueScheduleTest = async (
  repositories,
  createdSchedule,
  realSchedule
) => {
  const { rabbitMqRepository } = repositories;

  const params = [];
  for (const element of realSchedule) {
    if (element.type === "Ujian Masuk" || element.type === "Seleksi Kelas") {
      const data = _.find(createdSchedule, { sessionId: element.id });

      const rabbitData = {
        scheduleId: data.id,
        courseId: data.courseId,
        totalStudent: element.totalStudent,
      };
      element.type === "Ujian Masuk"
        ? (rabbitData.type = "Ujian Masuk")
        : (rabbitData.type = "Seleksi Kelas");

      params.push(rabbitData);
    }
  }

  await rabbitMqRepository.publishQueue(
    "ba.registration:create",
    registrationExchange,
    params
  );
};

module.exports = createQueueScheduleTest;
