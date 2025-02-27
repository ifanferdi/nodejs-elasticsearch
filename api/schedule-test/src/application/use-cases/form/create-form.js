const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");
const config = require("../../../config/config");
const formType = config.applicationBehaviour.formType;
const scheduleTestExchange = config.rabbitmq.scheduleTestExchange;

const validate = (params) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    file: Joi.required(),
    questionForm: Joi.array()
      .required()
      .unique()
      .items(Joi.number().valid(...formType)),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const createForm = async (repositories, params, files) => {
  const { formRepository, rabbitMqRepository } = repositories;

  const { name, questionForm } = params;
  const { file, fileSystem } = files;

  validate({ name, questionForm, file });

  const { originalname, buffer } = file;

  // validator

  // uploading file
  const filename = "form/files/" + Date.now() + "-" + originalname;
  await fileSystem.put(buffer, filename);
  params.file = filename;

  params.questionForm = questionForm.map((value) => {
    return Number(value);
  });

  const createForm = await formRepository.createForm(params);

  await publishToAnalytic(rabbitMqRepository, createForm.dataValues);

  return { message: "Success." };
};

const publishToAnalytic = async (rabbitMqRepository, data) => {
  // Publish For Analytic
  await rabbitMqRepository.publishQueue(
    "ba.schedule.test.form:create",
    scheduleTestExchange,
    data
  );
};

module.exports = createForm;
