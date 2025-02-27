const { DataTypes } = require("sequelize");
const relation = require("../../../helpers/relational-model-helper");
const Error = require("../../../../frameworks/helpers/app-error");
const config = require("../../../../config/config");
const formTypeText = config.applicationBehaviour.formTypeText;

/**
 * @param sequelize {import('sequelize').Sequelize}
 */
module.exports = (sequelize, withRelation = ["*"]) => {
  const model = sequelize.define(
    "form",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      file: { type: DataTypes.STRING, allowNull: false },
      questionForm: { type: DataTypes.JSON, allowNull: false },
    },
    {
      timestamps: true,
      tableName: "forms",
    }
  );

  relation(withRelation, "schedule", () =>
    model.hasMany(require("./schedule-test")(sequelize, []))
  );

  relation(withRelation, "questionServed", () =>
    model.hasMany(require("./questionServed")(sequelize, []))
  );

  model.questionForm = (key) => {
    if (formTypeText[key]) return formTypeText[key];

    throw new Error("Invalid question form", 500);
  };

  return model;
};
