const Joi = require("joi");
const Error = require("../../../../frameworks/helpers/app-error");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const XLSX = require("../../../../frameworks/helpers/xlsx/xlsx.bundle");
const _ = require("lodash");
const findByIdSchedule = require("../get/find-by-id-schedule-test");
const moment = require("moment/moment");

const validate = (params) => {
  const schema = Joi.object({
    id: Joi.number().invalid(":id"),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const ExportByIdSchedule = async (repositories, fileSystem, params) => {
  validate(params);

  let schedule = await findByIdSchedule(repositories, params);
  if (!schedule) throw new Error("Data not found.", 404);

  const row = {
    course: schedule.session?.schedule.batch.course.batchName,
    classroom: schedule.session?.schedule.classroom.name,
    subject: schedule.session.subject.name,
    teacher:
      schedule.session.teacher.profile.fullName +
      " - " +
      schedule.session.teacher.profile.registrationNumber,
    date: moment(schedule.date).format("DD-MM-YYYY hh:mm"),
    duration: schedule.duration + " menit",
    type: _.capitalize(schedule.type),
    room: schedule.session?.room,
    desc: schedule.desc,
  };

  const filename = `temp/export/JADWAL - ${schedule.type} - ${
    schedule.session.subject.name
  } - ${moment(schedule.date).format("DD-MM-YYYY hh.mm")} - ${
    schedule.session?.schedule.batch.course.batchName
  }.xlsx`;

  const template = ejs.compile(
    fs.readFileSync(
      path.join(
        __dirname,
        "../../../../frameworks/exports/schedule-test/schedule-test-by-id.ejs",
      ),
      "utf8",
    ),
  );

  /* obtain HTML string.  This example reads from test.html */
  const html_str = template({ schedule: row });

  /* get first TABLE element */
  const doc = new JSDOM(html_str).window.document.querySelector("table");

  const worksheet = XLSX.utils.table_to_sheet(doc);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet);

  const width = [];
  width.push({ wch: 15 });
  const values = _.values(row);
  const widths = [];

  values.forEach((value) => {
    let max_width = Math.max(0, String(value).length);
    widths.push(max_width);
  });
  width.push({ wch: _.max(widths) });

  /* set column width */
  worksheet["!cols"] = width;

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  await fileSystem.put(buffer, filename);

  return { url: await fileSystem.getUrl(filename) };
};

module.exports = ExportByIdSchedule;
