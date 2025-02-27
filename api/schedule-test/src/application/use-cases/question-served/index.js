const createOrUpdateQuestionServed = require("./create-update-question-served");
const getByIdQuestionServed = require("./find-by-id-question-served");
const getAllQuestionServed = require("./get-all-question-served");

module.exports = (repositories) => {
  return {
    createOrUpdateQuestionServed: createOrUpdateQuestionServed.bind(
      null,
      repositories
    ),
    getByIdQuestionServed: getByIdQuestionServed.bind(null, repositories),
    getAllQuestionServed: getAllQuestionServed.bind(null, repositories),
  };
};
