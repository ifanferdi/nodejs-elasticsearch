const QuestionController = (useCases) => {
  const { getQuestionByIdScheduleTest } = useCases?.questionUseCases;

  const getQuestionByScheduleId = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const scheduleId = req.params.scheduleId;

      const forms = await getQuestionByIdScheduleTest({
        page,
        limit,
        scheduleId,
      });

      res.json(forms);
    } catch (err) {
      next(err);
    }
  };
  return { getQuestionByScheduleId };
};
module.exports = QuestionController;
