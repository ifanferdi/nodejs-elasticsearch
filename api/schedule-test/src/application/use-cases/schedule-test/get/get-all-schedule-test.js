const paginate = require("../../../../frameworks/helpers/resource-pagination");
const Joi = require("joi");
const Error = require("../../../../frameworks/helpers/app-error");
const _ = require("lodash");
const { lowerCase } = require("lodash");
const moment = require("moment");

const validate = (params) => {
  const schema = Joi.object({
    page: Joi.number(),
    limit: Joi.number().max(10000),
    batchId: Joi.when("limit", {
      is: -1,
      then: Joi.forbidden(),
      otherwise: Joi.invalid(":batchId").allow(null),
    }),
    classroomId: Joi.when("limit", {
      is: -1,
      then: Joi.forbidden(),
      otherwise: Joi.invalid(":classroomId").allow(null),
    }),
    courseId: Joi.invalid(":courseId").allow(null),
    sessionId: Joi.array().allow(null),
    courseNumberOrArray: Joi.when("courseId", {
      is: Joi.number(),
      then: Joi.number(),
      otherwise: Joi.array(),
    }),
    subjectId: Joi.number().invalid(":subjectId").allow(null),
    type: Joi.string().allow(null).valid("kuis", "ujian"),
    date: Joi.date().allow(""),
    status: Joi.string().allow(null).valid("all", "past", "present", "future"),
    userId: Joi.string().allow(null),
    startDateSearch: Joi.date().allow(null),
    endDateSearch: Joi.date().allow(null),
    sortType: Joi.string().valid("ASC", "DESC", "asc", "desc"),
    sort: Joi.string().valid("courseId", "sessionId", "date", "duration", "type", "desc"),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const getAllScheduleTest = async (repositories, params) => {
  const { scheduleTestRepository, apiRepository, meilisearchRepository } = repositories;

  const { page, limit, courseId, subjectId, type, sessionId } = params;
  const { date, status, profileId, sort, sortType, search } = params;
  const { batchId, classroomId } = params;

  const { scheduleApiRepository, profileApiRepository } = apiRepository;

  const startDateSearch = search ? search.startDateSearch : null;
  const endDateSearch = search ? search.endDateSearch : null;

  const offset = (page - 1) * limit;

  // validator
  validate({
    page,
    limit,
    courseId,
    batchId,
    classroomId,
    subjectId,
    type,
    sessionId,
    date,
    status,
    startDateSearch,
    endDateSearch,
  });

  let data, total;

  // if limit > 0 { search to meilisearch } else { search to db }
  if (limit > 0) {
    const { data: meiliData, count } = await meilisearchRepository.getScheduleBySubjectId(subjectId, {
      offset,
      limit,
      courseId,
      batchId,
      classroomId,
      type,
      date,
      sessionId,
      status,
      sort,
      sortType,
      search: startDateSearch && endDateSearch ? { startDate: startDateSearch, endDate: endDateSearch } : null,
    });

    console.log("-- Success getting data to meilisearch.");

    data = meiliData;
    total = count;
  } else {
    data = await scheduleTestRepository.getAllSchedule({
      offset,
      limit,
      courseId,
      subjectId,
      type,
      date,
      sessionId,
      status,
      sort,
      sortType,
      search: startDateSearch && endDateSearch ? [startDateSearch, endDateSearch] : null,
    });

    total = await scheduleTestRepository.countSchedule({
      courseId,
      sessionId,
      type,
      date,
      status,
      search: startDateSearch && endDateSearch ? [startDateSearch, endDateSearch] : null,
    });
  }

  if (data.length === 0) return paginate(page, limit, 0, []);

  // Getting session Data
  let sessionIds = _.map(data, (session) => {
    return Number(session.sessionId);
  });
  sessionIds = _.union(sessionIds);
  const sessions = await scheduleApiRepository.findBulkSessionByIds(sessionIds);

  data = assignSessionToScheduleData(sessions, data);

  data = addTypeWithCategory(data);

  data = populateBatch(data);

  if (profileId) {
    // Check is student can take the test
    const profile = await profileApiRepository.getProfileById(profileId);
    if (lowerCase(profile.profile.typeAcc) === "siswa")
      data = await checkIsAlreadyTaken(apiRepository, data, profileId);

    // cek is wi can edit this schedule
    if (lowerCase(profile.profile.typeAcc) === "wi") data = await checkIsEditable(apiRepository, data, profileId);
  }

  return paginate(page, limit, total, data);
};

const checkIsEditable = async (apiRepository, data, profileId) => {
  data.forEach((row) => {
    let isEditable = false;

    if (row.session.teacherId === profileId || row.session.schedule.classroom.classMasterId === profileId)
      isEditable = true;

    row.isEditable = isEditable;
  });

  return data;
};

const checkIsAlreadyTaken = async ({ assessmentCbtApiRepository, courseApiRepository }, data, profileId) => {
  const scheduleIds = _.map(data, (schedule) => Number(schedule.id));

  // GET STUDENT COURSE BY PROFILE ID
  const studentCourses = await courseApiRepository.getStudentCourseByProfileId(profileId, { status: "Aktif" });
  const studentCourse = studentCourses[0];

  const notFinishedAssessments = await assessmentCbtApiRepository.findWorkTest({
    limit: -1,
    scheduleIds,
    studentCourseId: studentCourse.id,
    status: ["Not Start", "Working"],
  });

  data.forEach((schedule) => {
    _.assign(schedule, { playable: false });

    const notStart = _.find(notFinishedAssessments, {
      scheduleId: Number(schedule.id),
    });

    const start = moment(new Date(schedule.date + "T" + schedule.startTime)).subtract(1, "minute");
    const end = moment(new Date(schedule.date + "T" + schedule.endTime)).add(1, "minute");

    // jika siswa belum ngerjain & jadwal sudah mulai & token udah diisi & penyajian soal sudah ada
    if (notStart && moment().isBetween(start, end) && schedule.token && schedule.questionServed)
      schedule.playable = true;
  });

  return data;
};

const assignSessionToScheduleData = (sessions, schedules) => {
  schedules.forEach((schedule) => {
    sessions?.forEach((session) => {
      if (session.id === schedule.sessionId) {
        const { id: idSession, scheduleId, subjectId, category } = session;
        const { startTime, endTime, teacherId, room, description } = session;
        const { schedule: scheduleSession, teacher, subject } = session;
        const profileTeacher = {
          _id: teacher?._id,
          ...teacher?.profile,
        };
        schedule.session = {
          id: idSession,
          scheduleId,
          subjectId,
          category,
          startTime,
          endTime,
          teacherId,
          room,
          description,
          teacher: profileTeacher,
          schedule: _.omit(scheduleSession, ["batch.classrooms"]),
          subject: _.omit(subject, ["metaData"]),
        };
      }
    });
  });

  return schedules;
};

const populateBatch = (schedules) => {
  schedules.forEach((element) => {
    element.batch = element?.session?.schedule?.batch;
  });

  return schedules;
};

const addTypeWithCategory = (schedules) => {
  schedules.forEach((element) => {
    element.typeCategory =
      element?.session?.category === "Kuis" || element?.session?.category === "kuis"
        ? `${element?.type}`
        : `${element?.type} (${element?.session?.category})`;
  });

  return schedules;
};

module.exports = getAllScheduleTest;
