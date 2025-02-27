const { findWorkTest: getWorkTest } = require("../api/assessment-cbt-service");

const AssessmentCbtRepository = () => {
  const findWorkTest = async (params) => {
    return await getWorkTest(params);
  };

  return { findWorkTest };
};

module.exports = AssessmentCbtRepository;
