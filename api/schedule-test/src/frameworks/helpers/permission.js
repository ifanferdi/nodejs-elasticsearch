/**
 *
 * @param {Object} objRef parameter of refrence object passing
 * @param {*} param1
 * @returns {Object}
 */

const permissionTrigger = ({ permissions, permissionIf, usecaseMethod }) => {
  // ignore permissions
  if (permissions === undefined) return {};

  if (!permissions.includes(permissionIf)) return {};

  return usecaseMethod();
};

/**
 *
 * @param {*} res
 * @param {*} param1
 * usecaseMethod true or false depending on permissions
 *
 */
const permissionGuard = async (
  res,
  { permissions, permission, usecaseMethod }
) => {
  console.error("Guard Trigger :");
  console.log("Permissions :", permissions);
  console.log("Permissions guard :", permission);

  if (permissions === undefined) return false;

  perms = JSON.parse(permissions);

  /**if have not permission */
  if (!perms.includes(permission)) return false;

  if (!(await usecaseMethod())) {
    res.status(401).send({ message: "Unauthorized Access This Resource" });

    return true;
  }

  return false;
};

module.exports = { permissionTrigger, permissionGuard };
