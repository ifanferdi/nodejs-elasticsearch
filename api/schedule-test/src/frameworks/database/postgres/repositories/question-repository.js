const QuestionRepository = (models) => {
  const { questionModel: model, questionServedModel } = models;

  const getQuestionByIds = async (params) => {
    const { questionServedId, offset, limit } = params;
    return await model.findAll({
      where: { questionServedId: questionServedId },
      offset,
      limit: limit === -1 ? null : limit,
    });
  };

  const getQuestionByIdScheduleId = async (params) => {
    const { scheduleId, offset, limit } = params;

    const { count, rows } = await model.findAndCountAll({
      where: { "$questionServed.scheduleId$": scheduleId },
      offset,
      limit: limit === -1 ? null : limit,
      include: [{ model: questionServedModel, as: "questionServed" }],
    });

    return { count, rows };
  };

  const countQuestion = async (params) => {
    return await model.count({ where: params });
  };

  const bulkCreateScheduleQuestion = async (params) => {
    await model.bulkCreate(params);

    return { message: "Success." };
  };

  const bulkDeleteScheduleQuestion = async (questionServedId) => {
    await model.destroy({ where: { questionServedId: questionServedId } });

    return { message: "Success." };
  };

  return {
    getQuestionByIds,
    getQuestionByIdScheduleId,
    countQuestion,
    bulkCreateScheduleQuestion,
    bulkDeleteScheduleQuestion,
  };
};

module.exports = QuestionRepository;
