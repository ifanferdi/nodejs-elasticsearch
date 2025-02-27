const _ = require("lodash");
const { permissionGuard } = require("../../frameworks/helpers/permission");
const config = require("../../config/config");

let fileSystem;
if (config.filesystem === "s3") {
  fileSystem = require("../../frameworks/filesystem/s3");
} else {
  fileSystem = require("../../frameworks/filesystem/local");
}

const QuestionServedController = (useCases) => {
  const {
    createOrUpdateQuestionServed,
    getByIdQuestionServed,
    getAllQuestionServed,
  } = useCases?.questionServedUseCases;
  const { guardScheduleAssign, getScheduleTestById } =
    useCases?.scheduleTestUseCases;

  const getAll = async (req, res, next) => {
    try {
      const scheduleId = Number(req.params.scheduleId);

      const questions = await getAllQuestionServed({ scheduleId });

      res.json(questions);
    } catch (err) {
      next(err);
    }
  };

  const findById = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const question = await getByIdQuestionServed(fileSystem, { id });

      res.json(question);
    } catch (err) {
      next(err);
    }
  };

  const createOrUpdate = async (req, res, next) => {
    try {
      const scheduleId = req.params.scheduleId;
      const body = req.body;
      const params = _.merge({}, { scheduleId, body });

      const profileId = req.headers["profile-id"] || null;
      // ========================== KONG PERMISSIONS ==========================
      if (
        await permissionGuard(res, {
          permissions: req.headers["user-permissions"],
          permission: "can-mengelola_penyajian_soal_sendiri",
          usecaseMethod: async () => {
            const schedule = await getScheduleTestById({
              id: params.scheduleId,
            });
            return await guardScheduleAssign(profileId, schedule);
          },
        })
      )
        return;

      const create = await createOrUpdateQuestionServed(params);

      res.json(create);
    } catch (err) {
      next(err);
    }
  };

  return {
    getAll,
    findById,
    createOrUpdate,
  };
};
module.exports = QuestionServedController;
