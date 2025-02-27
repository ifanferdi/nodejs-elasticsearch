const config = require("../../../../config/config");
const sequelizeConnection = require("../../../../frameworks/database/sequelize-connection");
const rabbitmqConnection = require("../../../../frameworks/webserver/rabbitmq");
const sequelize = sequelizeConnection(config);
const scheduleTestExchange = config.rabbitmq.scheduleTestExchange;
const ScheduleModel = require("../../../../frameworks/database/postgres/models/schedule-test");
const questionServedModel = require("../../../../frameworks/database/postgres/models/questionServed");
const scheduleTestRepo = require("../../../../frameworks/database/postgres/repositories/schedule-test-repository");
const rabbitMqRepo = require("../../../../frameworks/database/rabbitmq/repositories/rabbitmq-repository");

(async () => {
  const rabbitmq = await rabbitmqConnection(config);
  const rabbitMqRepository = rabbitMqRepo(rabbitmq, { rabbitHelper: null });

  const schedule = await ScheduleModel(sequelize);
  const questionServed = await questionServedModel(sequelize);
  const scheduleTestRepository = scheduleTestRepo({
    scheduleTestModel: schedule,
    questionServedModel: questionServed,
  });

  const schedules = await getAllSchedules(scheduleTestRepository);

  // Publish For Analytic
  await rabbitMqRepository.publishQueue(
    "ba.schedule.test.schedule:create",
    scheduleTestExchange,
    schedules
  );

  setTimeout(function () {
    return process.exit(); //node js exit code
  }, 2000);
})();

const getAllSchedules = async (scheduleTestRepository) => {
  return await scheduleTestRepository.getAllSchedule({
    limit: -1,
    offset: 0,
    sort: "id",
    sortType: "ASC",
  });
};
