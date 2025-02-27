const config = require("../../config/config");
const { lowerCase } = require("lodash");
const { permissionGuard } = require("../../frameworks/helpers/permission.js");
const { permissionTrigger } = require("../../frameworks/helpers/permission");
const _ = require("lodash");

let fileSystem;
if (config.filesystem === "s3") {
  fileSystem = require("../../frameworks/filesystem/s3");
} else {
  fileSystem = require("../../frameworks/filesystem/local");
}

const ScheduleTestController = (useCases) => {
  const {
    getAllScheduleTest,
    getScheduleTestById,
    updateTokenScheduleTest,
    exportAllScheduleTest,
    exportScheduleTestById,
    sessionTrigger,
    assignSchedule,
    guardScheduleAssign,
    republishSchedule,
  } = useCases?.scheduleTestUseCases;

  const getAll = async (req, res, next) => {
    try {
      const params = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        courseId: req.query.courseId ? Number(req.query.courseId) : null,
        batchId: req.query.batchId ? Number(req.query.batchId) : undefined,
        classroomId: req.query.classroomId
          ? Number(req.query.classroomId)
          : undefined,
        search: {
          startDateSearch:
            req.query.startDate !== undefined
              ? new Date(req.query.startDate)
              : null,
          endDateSearch:
            req.query.endDate !== undefined
              ? new Date(req.query.endDate)
              : null,
        },
        type: lowerCase(req.query.type) || null,
        status: lowerCase(req.query.status) || "present",
        sort: req.query.sort || null,
        sortType: req.query.sortType || null,
        profileId: req.headers["profile-id"] || null,
        subjectId: req.query.subjectId || null,
        date: req.query.date,
      };

      const profileId = req.headers["profile-id"] || null;
      // ========================== KONG PERMISSIONS ==========================
      if (!params.batchId) {
        await permissionTrigger({
          permissions: req.headers["user-permissions"],
          permissionIf: "can-lihat_daftar_jadwal_sendiri",
          usecaseMethod: async () => {
            // untuk siswa
            params.sessionId = await sessionTrigger(profileId);
          },
        });
      } else {
        if (
          await permissionGuard(res, {
            permissions: req.headers["user-permissions"],
            permission: "can-lihat_daftar_jadwal_sendiri",
            usecaseMethod: async () => {
              // untuk siswa
              return await assignSchedule(profileId, params.batchId);
            },
          })
        )
          return;
      }

      const schedules = await getAllScheduleTest(params);

      res.json(schedules);
    } catch (err) {
      next(err);
    }
  };

  const findById = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const schedule = await getScheduleTestById({ id });

      const profileId = req.headers["profile-id"] || null;
      // ========================== KONG PERMISSIONS ==========================
      if (
        await permissionGuard(res, {
          permissions: req.headers["user-permissions"],
          permission: "can-lihat_daftar_jadwal_sendiri",
          usecaseMethod: async () => {
            return await assignSchedule(profileId, schedule.batchId);
          },
        })
      )
        return;

      res.json(schedule);
    } catch (err) {
      next(err);
    }
  };

  const update = async (req, res, next) => {
    try {
      const params = {
        id: Number(req.params.id),
        token: req.body.token,
      };

      const profileId = req.headers["profile-id"] || null;
      // ========================== KONG PERMISSIONS ==========================
      if (
        await permissionGuard(res, {
          permissions: req.headers["user-permissions"],
          permission: "can-mengelola_jadwal_sendiri",
          usecaseMethod: async () => {
            const schedule = await getScheduleTestById({ id: params.id });

            return await guardScheduleAssign(profileId, schedule);
          },
        })
      )
        return;

      const update = await updateTokenScheduleTest(params);

      res.json(update);
    } catch (err) {
      next(err);
    }
  };

  const exportAll = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || -1;
      const type = lowerCase(req.query.type) || null;
      const userId = req.headers.userid || null;

      const { url } = await exportAllScheduleTest(fileSystem, {
        page,
        limit,
        type,
        userId,
      });

      res.redirect(url);
    } catch (err) {
      next(err);
    }
  };

  const exportById = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { url } = await exportScheduleTestById(fileSystem, { id });
      res.redirect(url);
    } catch (err) {
      next(err);
    }
  };

  const republish = async (req, res, next) => {
    try {
      if (_.includes(req.body.publish, "analytic")) {
        const { data: schedules } = await getAllScheduleTest({
          page: 1,
          limit: -1,
          status: "all",
        });

        await republishSchedule({
          schedules: schedules,
          publish: req.body.publish,
        });
      }

      return res.json({ message: "success" });
    } catch (err) {
      next(err);
    }
  };

  return {
    getAll,
    findById,
    update,
    exportAll,
    exportById,
    republish,
  };
};
module.exports = ScheduleTestController;
