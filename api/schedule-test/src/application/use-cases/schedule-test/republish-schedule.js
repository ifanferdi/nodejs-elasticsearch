const config = require("../../../config/config");
const scheduleTestExchange = config.rabbitmq.scheduleTestExchange;
const moment = require("moment");
const _ = require("lodash");
const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");
moment.locale("id");

const validate = (params) => {
  const schema = Joi.object({
    publish: Joi.array().items("analytic"),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

module.exports = async (repositories, params) => {
  const { schedules, publish } = params;
  const { rabbitMqRepository } = repositories;

  validate({ publish });

  if (_.includes(publish, "analytic"))
    await publishToAnalytic(rabbitMqRepository, schedules);
};

const publishToAnalytic = async (rabbitMqRepository, schedules) => {
  for (const schedule of schedules) {
    // Publish For Analytic
    await rabbitMqRepository.publishQueue(
      "ba.schedule.test.schedule:create",
      scheduleTestExchange,
      [schedule],
    );
  }
};
