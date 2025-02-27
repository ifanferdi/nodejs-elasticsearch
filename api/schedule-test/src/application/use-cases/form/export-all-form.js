const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");
const XLSX = require("../../../frameworks/helpers/xlsx/xlsx.bundle");
const fs = require("fs");
const ejs = require("ejs");
const { JSDOM } = require("jsdom");
const path = require("path");
const _ = require("lodash");

const validate = (params) => {
  const schema = Joi.object({
    page: Joi.number(),
    limit: Joi.number().max(10000),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const getAllForm = async (repositories, fileSystem, params) => {
  const { formRepository } = repositories;

  const { page, limit, questionForm } = params;
  const offset = (page - 1) * limit;

  validate(params);

  let data = await formRepository.getAllForm({
    offset,
    limit,
    questionForm,
  });

  for (const form of data) {
    form.file = await fileSystem.getUrl(form.file);
  }

  const rows = _.map(data, (form) => {
    return {
      name: form.name,
      questionForm: form.questionForm,
    };
  });

  if (data.length === 0) throw new Error("Data is empty.", 404);

  const filename = `temp/export/DAFTAR BENTUK SOAL.xlsx`;

  const template = ejs.compile(
    fs.readFileSync(
      path.join(__dirname, "../../../frameworks/exports/form/form-all.ejs"),
      "utf8"
    )
  );

  /* obtain HTML string.  This example reads from test.html */
  const html_str = template({ forms: rows });

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
      if (r.questionForm) return Math.max(w, String(r[key][0].text).length);
      return Math.max(w, String(r[key]).length);
    }, 10);

    if (max_width < 20) max_width = 20;

    width.push({ wch: max_width });
  });

  /* set column width */
  worksheet["!cols"] = width;

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  await fileSystem.put(buffer, filename);

  return { url: await fileSystem.getUrl(filename) };
};

module.exports = getAllForm;
