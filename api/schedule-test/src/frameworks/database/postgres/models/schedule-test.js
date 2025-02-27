const { DataTypes } = require("sequelize");
const relation = require("../../../helpers/relational-model-helper");
const { Op } = require("sequelize");

/**
 * @param sequelize {import('sequelize').Sequelize}
 */
module.exports = (sequelize, withRelation = ["*"]) => {
  const model = sequelize.define(
    "schedule",
    {
      batchId: { type: DataTypes.BIGINT, allowNull: false },
      sessionId: { type: DataTypes.BIGINT, allowNull: false, unique: true },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      startTime: { type: DataTypes.TIME, allowNull: false },
      endTime: { type: DataTypes.TIME, allowNull: false },
      duration: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.STRING(50), allowNull: false },
      typeCategory: { type: DataTypes.VIRTUAL },
      token: { type: DataTypes.STRING(10), allowNull: true, unique: true },
      desc: { type: DataTypes.TEXT, allowNull: false },
      totalQuestions: { type: DataTypes.VIRTUAL },
      session: { type: DataTypes.VIRTUAL },
      course: { type: DataTypes.VIRTUAL },
      batch: { type: DataTypes.VIRTUAL },
      dateStartTime: {
        type: DataTypes.VIRTUAL,
        get() {
          return new Date(`${this.date}T${this.startTime}`);
        },
      },
      status: {
        type: DataTypes.VIRTUAL,
        get() {
          if (new Date(this.date + "T" + this.startTime) > new Date()) return "future";
          if (
            new Date(this.date + "T" + this.startTime) <= new Date() &&
            new Date(this.date + "T" + this.endTime) >= new Date()
          )
            return "present";
          if (new Date(this.date + "T" + this.endTime) <= new Date()) return "past";
        },
      },
    },
    {
      timestamps: true,
      tableName: "schedule-tests",
    },
  );

  relation(withRelation, "questionServed", () =>
    model.hasMany(require("./questionServed")(sequelize, ["questions", "form"]), {
      as: "questionServeds",
      foreignKey: "scheduleId",
    }),
  );

  model.checkUniqueToken = async (id, token) => {
    return await model.findOne({
      where: { token: token, id: { [Op.ne]: id } },
    });
  };

  return model;
};
