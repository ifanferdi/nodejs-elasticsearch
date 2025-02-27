const questionServedTestRepository = (models) => {
  const { questionServedModel: model, questionModel } = models;

  const getAllQuestionServed = async (params) => {
    const { scheduleId } = params;
    let query = { scheduleId: scheduleId };

    return await model.findAll({
      attributes: [
        "id",
        "formId",
        "duration",
        "randomize",
        "levelDifficult",
        "amount",
        "scheduleId",
      ],
      where: query,
      order: [["id", "ASC"]],
      include: [{ model: questionModel, as: "questions" }],
    });
  };

  const findByIdQuestionServed = async (params) => {
    const { id } = params;

    return await model.findByPk(id, {
      attributes: [
        "id",
        "formId",
        "duration",
        "randomize",
        "levelDifficult",
        "amount",
        "scheduleId",
      ],
      order: [["id", "ASC"]],
      include: [
        "form",
        "schedule-test",
        { model: questionModel, as: "questions" },
      ],
    });
  };

  const bulkCreateQuestionServed = async (params) => {
    return await model.bulkCreate(params);
  };

  const updateQuestionServed = async (params, id, scheduleId) => {
    return await model.update(params, {
      where: { id: id, scheduleId: scheduleId },
      returning: true,
    });
  };

  const updateByScheduleIdQuestionServed = async (params, scheduleId) => {
    return await model
      .update(params, { where: scheduleId })
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const bulkDeleteQuestionServed = async (ids) => {
    await model.destroy({ where: { id: ids } });

    return { message: "Success." };
  };

  const bulkDeleteQuestionServedByScheduleId = async (ids) => {
    await model.destroy({ where: { scheduleId: ids } });

    return { message: "Success." };
  };

  return {
    getAllQuestionServed,
    findByIdQuestionServed,
    bulkCreateQuestionServed,
    updateQuestionServed,
    updateByScheduleIdQuestionServed,
    bulkDeleteQuestionServed,
    bulkDeleteQuestionServedByScheduleId,
  };
};

module.exports = questionServedTestRepository;
