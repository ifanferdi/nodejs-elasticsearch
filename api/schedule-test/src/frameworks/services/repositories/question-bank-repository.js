const {
  generateQuestion: getQuestionGenerate,
  getQuestionByIds: fetchQuestionByIds,
} = require("../api/question-bank-service");

const QuestionBankRepository = () => {
  const generateQuestion = async (params) => {
    return await getQuestionGenerate(params);
  };

  const getQuestionByIds = async (params) => {
    return await fetchQuestionByIds(params);
  };

  return {
    generateQuestion,
    getQuestionByIds,
  };
};

module.exports = QuestionBankRepository;
