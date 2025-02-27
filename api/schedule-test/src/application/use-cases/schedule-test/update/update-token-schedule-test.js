const Joi = require("joi");
const Error = require("../../../../frameworks/helpers/app-error");
const config = require("../../../../config/config");
const scheduleTestExchange = config.rabbitmq.scheduleTestExchange;

const validate = async (params, model) => {
  const schema = Joi.object({
    id: Joi.number().invalid(":id"),
    token: Joi.string()
      .length(6)
      .required()
      .external(async (token) => {
        const checkToken = await model.checkUniqueToken(params.id, token);
        if (checkToken) {
          throw new Error("Token is already exist.");
        }
        return token;
      }),
  });

  const validator = await schema.validateAsync(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const updateTokenScheduleTest = async (repositories, params) => {
  const { scheduleTestRepository } = repositories;
  const { rabbitMqRepository } = repositories;

  const model = scheduleTestRepository.model;
  const { id, token } = params;

  await validate({ id, token }, model);

  const schedule = await scheduleTestRepository.findByIdSchedule(id);
  if (!schedule) throw new Error("Data not found.", 404);

  const updateSchedule = await scheduleTestRepository.updateSchedule(
    { token },
    id
  );

  // publish to rabbit
  await updateScheduleTestAnalytic(rabbitMqRepository, updateSchedule[1]);

  return updateSchedule[1];
};

const updateScheduleTestAnalytic = async (rabbitMqRepository, schedule) => {
  let params = [];
  params.push({
    id: schedule.sessionId,
    scheduleTestId: schedule.id,
    token: schedule.token,
    updatedAt: schedule.updatedAt,
  });

  await rabbitMqRepository.publishQueue(
    "ba.schedule.test.schedule:update",
    scheduleTestExchange,
    params
  );
};

module.exports = updateTokenScheduleTest;
