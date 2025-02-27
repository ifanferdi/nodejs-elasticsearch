const config = require("../../config/config");
const Error = require("../../frameworks/helpers/app-error");

const multer = require("multer");
const checkExtension = require("../../frameworks/helpers/check-file-extension");

let fileSystem;
if (config.filesystem === "s3") {
  fileSystem = require("../../frameworks/filesystem/s3");
} else {
  fileSystem = require("../../frameworks/filesystem/local");
}

const FormController = (useCases) => {
  const {
    getAllForm,
    getFormByIds,
    getFormById,
    createForm,
    updateForm,
    deleteForm,
    exportAllForm,
    exportFormById,
  } = useCases?.formUseCases;

  const getAll = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search;
      const sort = req.query.sort || null;
      const sortType = req.query.sortType || null;

      const forms = await getAllForm(fileSystem, {
        page,
        limit,
        search,
        sort,
        sortType,
      });

      res.json(forms);
    } catch (err) {
      next(err);
    }
  };

  const findById = async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const data = await getFormById(fileSystem, { id });
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  const getByIds = async (req, res, next) => {
    try {
      const { ids } = req.body;
      const data = await getFormByIds(fileSystem, { ids: ids });
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  const create = async (req, res, next) => {
    try {
      const file = req.file;
      const params = {
        name: req.body.name,
        questionForm:
          Array.isArray(req.body.questionForm) === false
            ? Array(req.body.questionForm)
            : req.body.questionForm,
      };

      const create = await createForm(params, { file, fileSystem });

      res.json(create);
    } catch (err) {
      next(err);
    }
  };

  const update = async (req, res, next) => {
    try {
      const file = req.file;
      const params = {
        id: Number(req.params.id),
        name: req.body.name,
        questionForm:
          Array.isArray(req.body.questionForm) === false
            ? Array(req.body.questionForm)
            : req.body.questionForm,
      };

      const update = await updateForm(params, {
        file,
        fileSystem,
      });

      res.json(update);
    } catch (err) {
      next(err);
    }
  };

  const destroy = async (req, res, next) => {
    try {
      const params = {
        id: Number(req.params?.id),
      };

      const destroy = await deleteForm(fileSystem, params);

      res.json(destroy);
    } catch (err) {
      next(err);
    }
  };

  const exportAll = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || -1;

      const { url } = await exportAllForm(fileSystem, {
        page,
        limit,
      });

      res.redirect(url);
    } catch (err) {
      next(err);
    }
  };

  const exportById = async (req, res, next) => {
    try {
      const id = Number(req.params.id);

      const { url } = await exportFormById(fileSystem, { id });

      res.redirect(url);
    } catch (err) {
      next(err);
    }
  };

  const uploadFile = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (checkExtension(file, /mp4/)) {
        cb(null, true);
      } else {
        cb(new Error("Only accepted mp4 file", 400), false);
      }
    },
  });

  const upload = uploadFile.single("file");

  return {
    getAll,
    findById,
    getByIds,
    create,
    update,
    destroy,
    exportAll,
    exportById,
    upload,
  };
};
module.exports = FormController;
