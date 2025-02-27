const { DataTypes } = require("sequelize");
const relation = require("../../../helpers/relational-model-helper");

/**
 * @param sequelize {import('sequelize').Sequelize}
 */
module.exports = (sequelize, withRelation = ["*"]) => {
  const model = sequelize.define(
    "question",
    {
      questionServedId: {
        type: DataTypes.BIGINT,
        references: { model: "questionServed", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false,
      },
      questionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      question: { type: DataTypes.VIRTUAL },
    },
    {
      timestamps: false,
      tableName: "questions",
    }
  );

  relation(withRelation, "questionServed", () =>
    model.belongsTo(
      require("./questionServed", {
        as: "questionServeds",
        foreignKey: "questionServedId",
      })(sequelize, [])
    )
  );

  return model;
};
