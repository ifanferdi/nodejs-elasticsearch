const Joi = require("joi");
const _ = require("lodash");
const fs = require("fs");
const XLSX = require("../../../../frameworks/helpers/xlsx/xlsx.bundle");
const Error = require("../../../../frameworks/helpers/app-error");
const moment = require("moment");
const getAllSchedule = require("../get/get-all-schedule-test");
const ejs = require("ejs");
const path = require("path");
const { JSDOM } = require("jsdom");

const validate = (params) => {
  const schema = Joi.object({
    page: Joi.number(),
    limit: Joi.number().max(10000),
    type: Joi.string().allow(null).valid("kuis", "ujian"),
    userId: Joi.string().allow(null),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const exportAllSchedule = async (repositories, fileSystem, params) => {
  const { page, limit, type, userId } = params;

  validate({ page, limit, type, userId });

  const { data } = await getAllSchedule(repositories, params);

  if (data.length === 0) throw new Error("Data not found.", 404);

  const rows = [];
  for (const row of data) {
    rows.push({
      course: row.session?.schedule.batch.course.batchName,
      subject: row.session?.subject.name,
      type: _.capitalize(row.type),
      date: moment(row.date).format("DD-MM-YYYY hh:mm"),
      duration: row.duration + " menit",
      desc: row.desc,
    });
  }

  const filename = `temp/export/DAFTAR JADWAL.xlsx`;

  const template = ejs.compile(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../frameworks/exports/schedule-test/schedule-test-all.ejs",
      ),
      "utf8",
    ),
  );

  /* obtain HTML string.  This example reads from test.html */
  const html_str = template({ schedules: rows });

  /* get first TABLE element */
  const doc = new JSDOM(html_str).window.document.querySelector("table");

  const worksheet = XLSX.utils.table_to_sheet(doc);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet);

  const width = [{ wch: 5 }];
  const keys = [];
  rows.forEach((element) => {
    keys.push(_.keys(element));
  });

  keys[0].map((key) => {
    let max_width = rows.reduce((w, r) => {
      return Math.max(w, String(r[key]).length);
    }, 10);

    if (max_width > 100) max_width = `100`;

    width.push({ wch: max_width });
  });

  /* set column width */
  worksheet["!cols"] = width;

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  await fileSystem.put(buffer, filename);

  return { url: await fileSystem.getUrl(filename) };
};

module.exports = exportAllSchedule;
