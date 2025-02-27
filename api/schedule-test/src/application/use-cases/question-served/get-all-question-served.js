const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");

const validate = (params) => {
  const schema = Joi.object({
    scheduleId: Joi.number().required(),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const getAllQuestionServed = async (repositories, params) => {
  const { questionServedRepository } = repositories;

  const { scheduleId } = params;

  validate(params);

  const schedules = await questionServedRepository.getAllQuestionServed({
    scheduleId,
  });
  if (schedules.length <= 0) throw new Error("Data not found.", 404);

  return schedules;
};

module.exports = getAllQuestionServed;
