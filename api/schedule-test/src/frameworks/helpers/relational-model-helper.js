const sequelizeLoadRelation = (withRelation, relname, cb) =>
  (withRelation.includes("*") || withRelation.includes(relname)) && cb();
module.exports = sequelizeLoadRelation;
