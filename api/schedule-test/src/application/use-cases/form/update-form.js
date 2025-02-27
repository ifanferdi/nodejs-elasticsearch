const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");
const _ = require("lodash");
const config = require("../../../config/config");
const scheduleTestExchange = config.rabbitmq.scheduleTestExchange;
const formType = config.applicationBehaviour.formType;

const validate = (params) => {
  const schema = Joi.object({
    id: Joi.number().required().invalid(":id"),
    name: Joi.string().required(),
    questionForm: Joi.array()
      .required().items(Joi.number().valid(...formType)),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const updateForm = async (repositories, params, files) => {
  const { formRepository, rabbitMqRepository } = repositories;

  const { id, name, questionForm } = params;
  const { file, fileSystem } = files;

  validate({ id, name, questionForm });

  const oldForm = await formRepository.findByIdForm(id);

  if (!oldForm) throw new Error("Data not found.", 404);

  let updateParams = { name, questionForm };

  if (file) {
    fileSystem.delete(oldForm.file);

    // uploading file
    const { originalname, buffer } = file;
    const filename = "form/files/" + Date.now() + "-" + originalname;
    const filePath = "/storage/" + filename;
    await fileSystem.put(buffer, filename);
    params.file = filePath;
    _.assign(updateParams, { file: filename });
  }

  updateParams.questionForm = questionForm.map((value) => {
    return Number(value);
  });

  const updateForm = await formRepository.updateForm(updateParams, id);

  // publish to rabbit
  await publishToAnalytic(rabbitMqRepository, updateForm[1].dataValues);

  return { message: "Success." };
};

const publishToAnalytic = async (rabbitMqRepository, form) => {
  await rabbitMqRepository.publishQueue(
    "ba.schedule.test.form:update",
    scheduleTestExchange,
    form
  );
};

module.exports = updateForm;
