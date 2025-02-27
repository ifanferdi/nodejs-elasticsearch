const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");
const config = require("../../../config/config");
const scheduleTestExchange = config.rabbitmq.scheduleTestExchange;

const validate = (params) => {
  const schema = Joi.object({
    id: Joi.number().invalid(":id"),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};
const destroyForm = async (repositories, fileSystem, params) => {
  const { formRepository, rabbitMqRepository } = repositories;

  validate(params);
  const { id } = params;

  const form = await formRepository.findByIdForm(id);
  if (!form) throw new Error("Data not found.", 404);

  fileSystem.delete(form.file);

  const deleteForm = await formRepository.destroyForm(params);

  await publishToAnalytic(rabbitMqRepository, deleteForm);

  return { message: "Success." };
};

const publishToAnalytic = async (rabbitMqRepository, data) => {
  // Publish For Analytic
  await rabbitMqRepository.publishQueue(
    "ba.schedule.test.form:delete",
    scheduleTestExchange,
    { id: data.id }
  );
};

module.exports = destroyForm;
