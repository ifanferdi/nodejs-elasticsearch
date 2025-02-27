const Joi = require("joi");
const Error = require("../../../frameworks/helpers/app-error");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const XLSX = require("../../../frameworks/helpers/xlsx/xlsx.bundle");
const _ = require("lodash");

const validate = (params) => {
  const schema = Joi.object({
    id: Joi.number().invalid(":id"),
  });

  const validator = schema.validate(params, {
    errors: { wrap: { label: false } },
  });
  if (validator.error) throw new Error(validator.error.message, 400);
};

const ExportByIdForm = async (repositories, fileSystem, params) => {
  const { formRepository } = repositories;

  validate(params);
  const { id } = params;

  let form = await formRepository.findByIdForm(id);
  if (!form) throw new Error("Data not found.", 404);

  form.file = await fileSystem.getUrl(form.file);

  form = {
    name: form.name,
    questionForm: form.questionForm,
  };

  const filename = `temp/export/BENTUK SOAL - ${form.name}.xlsx`;

  const template = ejs.compile(
    fs.readFileSync(
      path.join(__dirname, "../../../frameworks/exports/form/form-by-id.ejs"),
      "utf8"
    )
  );

  /* obtain HTML string.  This example reads from test.html */
  const html_str = template({ form: form });

  /* get first TABLE element */
  const doc = new JSDOM(html_str).window.document.querySelector("table");

  const worksheet = XLSX.utils.table_to_sheet(doc);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet);

  const width = [];
  width.push({ wch: 20 });
  const values = _.values(form);
  const widths = [];

  values.forEach((value) => {
    let max_width;
    if (Array.isArray(value)) {
      value.forEach((questionForm) => {
        max_width = Math.max(0, String(questionForm.text).length);
      });
    } else {
      max_width = Math.max(0, String(value).length);
    }
    widths.push(max_width);
  });
  width.push({ wch: _.max(widths) });

  /* set column width */
  worksheet["!cols"] = width;

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  await fileSystem.put(buffer, filename);

  return { url: await fileSystem.getUrl(filename) };
};

module.exports = ExportByIdForm;
