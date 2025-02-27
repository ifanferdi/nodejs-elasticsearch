const service = require("../api/schedule-service");

const ScheduleRepository = () => {
  const findByIdSession = async (id) => {
    return await service.findSessionById(id);
  };

  const findBulkSessionByIds = async (ids) => {
    return await service.findBulkSessionByIds(ids);
  };

  const findSession = async (params) => {
    return await service.findSession(params);
  };

  return {
    findByIdSession,
    findBulkSessionByIds,
    findSession,
  };
};

module.exports = ScheduleRepository;
