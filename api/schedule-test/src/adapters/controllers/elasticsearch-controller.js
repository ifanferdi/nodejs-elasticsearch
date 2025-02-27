const _ = require("lodash");
const scheduleTestIndexName = "schedule_test_index";
const prefixId = "schedule_test";

module.exports = (useCases) => {
  const { elasticsearchUseCases: elasticsearch, scheduleTestUseCases: schedule } = useCases;

  const checkIsBetweenQuery = (key, value) => {
    const isStartBetween = key.toLowerCase().startsWith("between");
    if (isStartBetween) {
      key = key.replace("between", "").toLowerCase();
      value = value.split(",");
    }
    return [isStartBetween, key, value];
  };

  const index = async (req, res, next) => {
    try {
      const filterException = _.omit(req.query, ["page", "limit", "search", "searchSources", "sort"]);
      const filter = {};
      const arrayFilter = {};
      const betweenFilter = {};
      Object.keys(filterException).map((key) => {
        if (Array.isArray(req.query[key])) arrayFilter[key] = req.query[key];
        else {
          const [isStartBetween, betweenKey, betweenValue] = checkIsBetweenQuery(key, req.query[key]);
          if (isStartBetween) betweenFilter[betweenKey] = betweenValue;
          else filter[key] = req.query[key];
        }
      });

      const params = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search,
        searchSources: req.query.searchSources,
        sort: req.query.sort,
        filter,
        arrayFilter,
        betweenFilter,
        index: scheduleTestIndexName,
      };

      res.json(await elasticsearch.getAllExample(params));
    } catch (e) {
      next(e);
    }
  };

  const show = async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = await elasticsearch.getByIdExample(scheduleTestIndexName, id);

      if (!data._found) res.status(404).json(data);

      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  const create = async (req, res, next) => {
    try {
      const { data: schedules } = await schedule.getAllScheduleTest({ page: 1, limit: -1 });
      const create = await elasticsearch.createExample({ index: scheduleTestIndexName, prefixId }, schedules);

      res.json({ message: "Success.", ...create });
    } catch (err) {
      next(err);
    }
  };

  const update = async (req, res, next) => {
    try {
      res.json({ message: "Success." });
    } catch (err) {
      next(err);
    }
  };

  const destroy = async (req, res, next) => {
    try {
      const result = await elasticsearch.deleteExample(scheduleTestIndexName, { id: req.query?.id, prefixId });
      res.json({ message: "Success.", ...result });
    } catch (err) {
      next(err);
    }
  };

  return { index, show, create, update, destroy };
};
