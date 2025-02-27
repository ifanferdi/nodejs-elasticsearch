const _ = require("lodash");
const { Op } = require("sequelize");
const scheduleTestRepository = (models) => {
  const { scheduleTestModel: model, questionServedModel } = models;

  const getAllSchedule = async (params) => {
    const { offset, limit, courseId, sessionId, subjectId, type, date, status, sort, sortType, search } = params;

    const q = query({
      courseId,
      subjectId,
      date,
      type,
      sessionId,
      status,
      search,
    });

    return await model.findAll({
      where: q,
      order: [[sort || "date", sortType || "DESC"]],
      offset,
      limit: limit === -1 ? null : limit,
      raw: true,
      // include: [{ model: questionServedModel, as: "questionServeds" }],
    });
  };

  const query = (params) => {
    const { courseId, type, status, search, date, sessionId } = params;
    let query = {};

    if (status === "all") query = {};
    if (status === "future")
      query = {
        [Op.or]: [
          { date: { [Op.gt]: new Date() } },
          {
            [Op.and]: [{ date: new Date() }, { startTime: { [Op.gt]: new Date().toLocaleTimeString() } }],
          },
        ],
      };
    if (status === "past")
      query = {
        [Op.or]: [
          { date: { [Op.lt]: new Date() } },
          {
            [Op.and]: [{ date: { [Op.lte]: new Date() } }, { endTime: { [Op.lte]: new Date().toLocaleTimeString() } }],
          },
        ],
      };
    if (status === "present")
      _.assign(query, {
        date: new Date(),
        startTime: { [Op.lte]: new Date().toLocaleTimeString() },
        endTime: { [Op.gte]: new Date().toLocaleTimeString() },
      });

    if (courseId) _.assign(query, { courseId: courseId });
    if (sessionId) _.assign(query, { sessionId: { [Op.in]: sessionId } });
    if (search) _.assign(query, { date: { [Op.between]: search } });
    if (type) _.assign(query, { type: type });
    if (date) _.assign(query, { date: date });

    return query;
  };

  const countSchedule = async (params) => {
    const q = query(params);

    return await model.count({ where: q });
  };

  const findByIdSchedule = async (id, include = []) => {
    const includes = ["questionServeds"];

    if (include.includes("questions"))
      includes.push({ association: "questionServeds", include: "questions" });

    if (include.includes("form"))
      includes.push({ association: "questionServeds", include: "form" });

    return await model.findByPk(id, {
      include: includes,
    });
  };

  const findByIdSession = async (id) => {
    return await model.findAll({
      where: { sessionId: id },
      include: [{ model: questionServedModel, as: "questionServeds" }],
    });
  };

  const findOneByIdSession = async (id) => {
    return await model.findOne({
      where: { sessionId: id },
      include: [{ model: questionServedModel, as: "questionServeds" }],
    });
  };

  const createSchedule = async (params) => {
    model.create(params);

    return { message: "Success." };
  };

  const bulkCreateSchedule = async (params) => {
    return await model.bulkCreate(params);
  };

  const updateSchedule = async (params, id) => {
    return await model.update(params, {
      where: { id: id },
      returning: true,
      plain: true,
    });
  };

  const updateScheduleBySessionId = async (params, id) => {
    return await model.update(params, {
      where: { sessionId: id },
      returning: true,
    });
  };

  const destroyBySessionIdSchedule = async (params) => {
    await model.destroy({ where: { sessionId: params } });

    return { message: "Success." };
  };

  return {
    getAllSchedule,
    countSchedule,
    findByIdSchedule,
    findByIdSession,
    findOneByIdSession,
    createSchedule,
    bulkCreateSchedule,
    updateSchedule,
    updateScheduleBySessionId,
    destroyBySessionIdSchedule,
    model,
  };
};

module.exports = scheduleTestRepository;
