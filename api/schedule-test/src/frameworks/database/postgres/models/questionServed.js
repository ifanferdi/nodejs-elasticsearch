const { DataTypes } = require("sequelize");
const relation = require("../../../helpers/relational-model-helper");

/**
 * @param sequelize {import('sequelize').Sequelize}
 */
module.exports = (sequelize, withRelation = ["*"]) => {
  const model = sequelize.define(
    "questionServed",
    {
      scheduleId: {
        type: DataTypes.BIGINT,
        references: { model: "schedule", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      formId: {
        type: DataTypes.BIGINT,
        references: { model: "form", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      duration: { type: DataTypes.INTEGER, allowNull: true },
      randomize: { type: DataTypes.BOOLEAN, allowNull: false },
      levelDifficult: { type: DataTypes.INTEGER, allowNull: true },
      amount: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      timestamps: true,
      tableName: "questionServeds",
    }
  );

  relation(withRelation, "schedule-test", () =>
    model.belongsTo(require("./schedule-test")(sequelize, []), {
      as: "schedule-test",
      foreignKey: "scheduleId",
    })
  );

  relation(withRelation, "form", () =>
    model.belongsTo(require("./form")(sequelize, []), {
      as: "form",
      foreignKey: "formId",
    })
  );

  relation(withRelation, "questions", () =>
    model.hasMany(require("./question")(sequelize, []), {
      as: "questions",
    })
  );

  return model;
};
