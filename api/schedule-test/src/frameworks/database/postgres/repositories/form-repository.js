const _ = require("lodash");
const { Op } = require("sequelize");

const formRepository = (models) => {
  const { formModel: model } = models;

  const getAllForm = async (params) => {
    const { offset, limit, search, sort, sortType } = params;

    let query = {};
    if (search) _.assign(query, { name: { [Op.substring]: search } });

    let forms = await model.findAll({
      where: query,
      order: [[sort || "name", sortType || "ASC"]],
      offset,
      limit: limit == -1 ? null : limit,
      raw: true,
    });

    for (const form of forms) {
      form.questionForm.forEach((question, index) => {
        form.questionForm[index] = {
          number: question,
          text: model.questionForm(question),
        };
      });
    }

    return forms;
  };

  const countForm = async (params) => {
    const { search } = params;

    let query = {};
    if (search) _.assign(query, { name: { [Op.substring]: search } });

    return await model.count({ where: query });
  };

  const findAll = async (ids) => {
    let forms = await model.findAll({ where: { id: ids } });

    if (forms) {
      forms.forEach((form) => {
        form.questionForm.forEach((question, index) => {
          form.questionForm[index] = {
            number: question,
            text: model.questionForm(Number(question)),
          };
        });
      });
    }

    return forms;
  };

  const findByIdForm = async (id) => {
    let form = await model.findOne({ where: { id: id } });

    if (form) {
      form.questionForm.forEach((question, index) => {
        form.questionForm[index] = {
          number: question,
          text: model.questionForm(Number(question)),
        };
      });
    }

    return form;
  };

  const createForm = async (params) => {
    const questionForm = params.questionForm;
    params.questionForm = questionForm.map((value) => {
      return Number(value);
    });

    return await model.create(params);
  };

  const updateForm = async (params, id) => {
    return await model.update(params, {
      where: { id },
      returning: true,
      plain: true,
    });
  };

  const destroyForm = async (id) => {
    return await model.findOne({ where: id }).then((result) => {
      model.destroy({ where: id });
      return result;
    });
  };

  return {
    getAllForm,
    countForm,
    findAll,
    findByIdForm,
    createForm,
    updateForm,
    destroyForm,
  };
};

module.exports = formRepository;
