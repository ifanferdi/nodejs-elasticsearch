const axios = require("axios");
const config = require("../../../config/config");
const questionUrl = config.url.api.question;
const Error = require("../../helpers/app-error");

const generateQuestion = async (params) => {
  const { data } = await axios
    .post(questionUrl + "/question/generate", params)
    .catch((error) => {
      console.log(error);
      throw new Error(error.response.data.message);
    });

  return data;
};

const getQuestionByIds = async (params) => {
  const { data } = await axios
    .post(questionUrl + "/question/fetch", params)
    .catch((error) => {
      console.log(error);
      throw new Error(error.response.data.message);
    });

  return data;
};

module.exports = {
  generateQuestion,
  getQuestionByIds,
};
