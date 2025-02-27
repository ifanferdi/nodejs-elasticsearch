const { create } = require("../api/notification-service");

const CourseRepository = () => {
  const createNotification = async (params) => {
    return await create(params);
  };

  return { createNotification };
};

module.exports = CourseRepository;
