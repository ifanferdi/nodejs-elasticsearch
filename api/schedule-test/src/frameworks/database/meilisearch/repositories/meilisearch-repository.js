const scheduleIndex = "ba_schedule_analytic";
const _ = require("lodash");
const moment = require("moment");

module.exports = (meilisearch) => {
  const getScheduleBySubjectId = async (subjectId, params) => {
    let {
      offset,
      limit,
      courseId,
      batchId,
      classroomId,
      type: category,
      date,
      status,
      sort,
      sortType,
      sessionId,
      search,
    } = params;

    const filter = filterData({
      courseId,
      batchId,
      classroomId,
      sessionId,
      category,
      date,
      status,
      search,
    });

    await meilisearch.index(scheduleIndex).updateSettings({
      searchableAttributes: ["subjectId"],
      filterableAttributes: [
        "test",
        "testSessionId",
        "testCourseId",
        "testType",
        "testDate",
        "testStartTime",
        "testEndTime",
        "batchId",
        "classroomId",
      ],
      sortableAttributes: [
        "testCourseId",
        "testSessionId",
        "testDate",
        "testDuration",
        "testType",
        "testDesc",
        "batchId",
        "classroomId",
      ],
    });

    // Sorting init
    sort = sort ? `test${_.upperFirst(sort)}` : "testDate";
    sortType = sortType ? _.lowerCase(sortType) : "desc";
    const sorting = `${sort}:${sortType}`;

    const { hits, estimatedTotalHits } = await meilisearch
      .index(scheduleIndex)
      .search(subjectId, {
        limit: limit,
        offset: offset,
        filter: filter,
        sort: [sorting],
      });

    // preparing data for return data
    let data = [];
    hits.forEach((element) => {
      data.push({
        id: element.testId,
        batchId: element.testBatchId,
        sessionId: element.testSessionId,
        date: moment(new Date(element.testDate)).format("YYYY-MM-DD"),
        startTime: moment(new Date(element.testStartTime)).format("HH:mm:ss"),
        endTime: moment(new Date(element.testEndTime)).format("HH:mm:ss"),
        duration: element.testDuration,
        type: element.testType,
        token: element.testToken,
        desc: element.testDesc,
        createdAt: new Date(element.testCreatedAt),
        updatedAt: new Date(element.testUpdatedAt),
      });
    });

    return { data: data, count: estimatedTotalHits };
  };

  const filterData = (params) => {
    const { courseId, category, date, status, search, sessionId } = params;
    const { batchId, classroomId } = params;

    let startDate = search?.startDate;
    let endDate = search?.endDate;

    let filter = "test EXISTS";
    if (batchId) filter = filter + ` AND batchId = ${batchId}`;
    if (classroomId) filter = filter + ` AND classroomId = ${classroomId}`;
    if (courseId) filter = filter + ` AND testCourseId = ${courseId}`;
    if (sessionId) filter = filter + ` AND testSessionId IN [${sessionId}]`;
    if (category) filter = filter + ` AND testType = ${category}`;
    if (date)
      filter =
        filter +
        ` AND testDate = ${Date.parse(new Date(date).toLocaleDateString())}`;

    if (search) {
      startDate = Date.parse(new Date(startDate.toLocaleDateString()));
      endDate = Date.parse(new Date(endDate.toLocaleDateString()));
      filter =
        filter + ` AND (testDate >= ${startDate} AND testDate <= ${endDate})`;
    }

    if (status) {
      if (status === "future")
        filter =
          filter +
          ` AND (testDate > '${Date.parse(
            new Date().toLocaleDateString(),
          )}' OR (testDate = '${Date.parse(
            new Date().toLocaleDateString(),
          )}' AND testStartTime > '${Date.parse(new Date())}'))`;

      if (status === "past")
        filter =
          filter +
          ` AND (testDate < '${Date.parse(
            new Date().toLocaleDateString(),
          )}' OR (testDate <= '${Date.parse(
            new Date().toLocaleDateString(),
          )}' AND testEndTime <= '${Date.parse(new Date())}'))`;

      if (status === "present")
        filter =
          filter +
          ` AND testDate = '${Date.parse(
            new Date().toLocaleDateString(),
          )}' AND testStartTime <= '${Date.parse(
            new Date(),
          )}' AND testEndTime >= '${Date.parse(new Date())}'`;
    }

    return filter;
  };

  return { getScheduleBySubjectId };
};
