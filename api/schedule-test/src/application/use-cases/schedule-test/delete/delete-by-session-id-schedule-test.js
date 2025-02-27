const Joi = require("joi");
const Error = require("../../../../frameworks/helpers/app-error");

const validate = (params) => {
  const schema = Joi.array().items(Joi.number());

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const deleteBySessionIdScheduleTest = async (repositories, params) => {
  const { scheduleTestRepository } = repositories;

  validate(params);

  const schedules = await scheduleTestRepository.findByIdSession(params);

  await scheduleTestRepository.destroyBySessionIdSchedule(params);

  return schedules;
};

module.exports = deleteBySessionIdScheduleTest;
