const getAllForm = require("./get-all-form");
const getFormByIds = require("./get-by-ids-form");
const getFormById = require("./find-by-id-form");
const createForm = require("./create-form");
const updateForm = require("./update-form");
const deleteForm = require("./destroy-form");
const exportAllForm = require("./export-all-form");
const exportFormById = require("./export-by-id-form");

module.exports = (repositories) => {
  return {
    getAllForm: getAllForm.bind(null, repositories),
    getFormByIds: getFormByIds.bind(null, repositories),
    getFormById: getFormById.bind(null, repositories),
    createForm: createForm.bind(null, repositories),
    updateForm: updateForm.bind(null, repositories),
    deleteForm: deleteForm.bind(null, repositories),
    exportAllForm: exportAllForm.bind(null, repositories),
    exportFormById: exportFormById.bind(null, repositories),
  };
};
