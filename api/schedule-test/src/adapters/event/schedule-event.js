const config = require("../../config/config");
const _ = require("lodash");
const moment = require("moment");
const { capitalize } = require("lodash");
const scheduleExchange = config.rabbitmq.scheduleExchange;
const scheduleTestExchange = config.rabbitmq.scheduleTestExchange;

const ScheduleEvent = async (repositories, helpers, meilisearch, useCases) => {
  const { rabbitMqRepository, apiRepository } = repositories;
  const { courseApiRepository } = apiRepository;
  const { createNotification } = helpers;
  const {
    getScheduleTestById,
    createQueueScheduleTest,
    createQueueRegistration,
    bulkCreateScheduleTest,
    updateScheduleTest,
    deleteBySessionIdScheduleTest,
    deleteQueueScheduleTest,
    deleteQueueRegistration,
  } = useCases.scheduleTestUseCases;

  const createSchedule = async () => {
    await rabbitMqRepository.subscribeQueue(
      "ba.schedule:create",
      scheduleExchange,
      async (cb) => {
        const schedules = await bulkCreateScheduleTest(cb);
        console.log(
          "------------------------------------ \n Success create data schedule from akademik: ",
          JSON.stringify(cb),
        );

        for (const schedule of cb) {
          // --- Send Notification ---
          await sendNotification(
            courseApiRepository,
            createNotification,
            schedule,
          );
        }
        // --- add data schedule test for analytic ---
        await addingScheduleTestAnalytic(schedules);

        // Publish data for work test
        await createQueueScheduleTest(schedules, cb);

        // Publish data for registration
        await createQueueRegistration(schedules, cb);
      },
    );
  };

  const updateSchedule = async () => {
    await rabbitMqRepository.subscribeQueue(
      "ba.schedule:update",
      scheduleExchange,
      async (cb) => {
        const schedules = await updateScheduleTest(cb);
        console.log(
          "------------------------------------ \n Success update data schedule from akademik: ",
          JSON.stringify(cb),
        );

        // --- add data schedule test for analytic ---
        await updateScheduleTestAnalytic(schedules);

        // Publish data for work test
        await createQueueScheduleTest(schedules, cb);
      },
    );
  };

  const deleteSchedule = async () => {
    await rabbitMqRepository.subscribeQueue(
      "ba.schedule:delete",
      scheduleExchange,
      async (cb) => {
        const schedules = await deleteBySessionIdScheduleTest(cb);

        // --- add data schedule test for analytic ---
        await deleteScheduleTestAnalytic(schedules);

        // Publish data for work test
        await deleteQueueScheduleTest(schedules);

        // Publish data for registration
        await deleteQueueRegistration(schedules);
      },
    );
  };

  const addingScheduleTestAnalytic = async (schedules) => {
    const data = [];
    for (const schedule of schedules) {
      data.push(await getScheduleTestById({ id: schedule.id }));
    }
    await rabbitMqRepository.publishQueue(
      "ba.schedule.test.schedule:create",
      scheduleTestExchange,
      data,
    );
  };

  const deleteScheduleTestAnalytic = async (schedules) => {
    let ids = _.map(schedules, "sessionId");

    await rabbitMqRepository.publishQueue(
      "ba.schedule.test.schedule:delete",
      scheduleTestExchange,
      ids,
    );
  };

  const updateScheduleTestAnalytic = async (schedules) => {
    let params = [];
    schedules.forEach((schedule) => {
      params.push({
        id: schedule.sessionId,
        duration: schedule.duration,
        token: schedule.token,
        desc: schedule.desc,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      });
    });

    await rabbitMqRepository.publishQueue(
      "ba.schedule.test.schedule:update",
      scheduleTestExchange,
      params,
    );
  };

  const sendNotification = async (
    courseApiRepository,
    createNotification,
    data,
  ) => {
    let students;
    if (["Ujian Masuk", "Seleksi Kelas"].includes(data.type))
      students = await courseApiRepository.getStudents({
        batchId: data.batchId,
      });
    else
      students = await courseApiRepository.getStudents({
        classroomId: data.classroomId,
      });

    const studentIds = [];
    _.map(students, (student) => {
      const { ssoId } = student.student;
      if (ssoId) studentIds.push(ssoId);
    });
    const date = moment(data.date).format("DD MMMM YYYY");

    await createNotification({
      user_ids: studentIds,
      provider: ["database"],
      data: {
        subject: `Jadwal ${capitalize(data.type)} Baru`,
        message: `Anda memiliki jadwal ${data.type} baru pada ${date} pukul ${data.startTime}.`,
        url: `${config.frontUrl.ubk}/jadwal/${data.id}`,
      },
    });
  };

  return { createSchedule, updateSchedule, deleteSchedule };
};

module.exports = ScheduleEvent;
