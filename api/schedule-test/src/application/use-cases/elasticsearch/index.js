const getAllExample = require("./get-all-example");
const getByIdExample = require("./get-by-id-example");
const createExample = require("./create-example");
const updateExample = require("./update-example");
const deleteExample = require("./delete-example");

module.exports = (repositories) => {
  return {
    getAllExample: getAllExample.bind(null, repositories),
    getByIdExample: getByIdExample.bind(null, repositories),
    createExample: createExample.bind(null, repositories),
    updateExample: updateExample.bind(null, repositories),
    deleteExample: deleteExample.bind(null, repositories),
  };
};
