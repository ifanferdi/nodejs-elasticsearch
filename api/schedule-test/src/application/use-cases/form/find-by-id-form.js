const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");

const validate = (params) => {
  const schema = Joi.object({
    id: Joi.number().invalid(":id"),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const findByIdForm = async (repositories, fileSystem, params) => {
  const { formRepository } = repositories;

  validate(params);
  const { id } = params;

  let data = await formRepository.findByIdForm(id);
  if (!data) throw new Error("Data not found.", 404);

  data.file = await fileSystem.getUrl(data.file);

  return data;
};

module.exports = findByIdForm;
