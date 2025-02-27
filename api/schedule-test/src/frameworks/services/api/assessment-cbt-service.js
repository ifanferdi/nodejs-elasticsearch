const axios = require("axios");
const config = require("../../../config/config");
const assessmentCbtUrl = config.url.api.assessmentCbt;

const findWorkTest = async (params) => {
  const { scheduleIds, studentCourseId } = params;
  const data = await axios
    .post(assessmentCbtUrl + "/work-test/get", {
      scheduleIds,
      studentCourseId,
    })
    .catch((error) => {
      console.log(error);
    });

  return data?.data?.data;
};

module.exports = {
  findWorkTest,
};
