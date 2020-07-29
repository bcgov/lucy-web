/**
 * SQL query to fetch a user and their associated role.
 *
 * @param {string} email user email
 * @returns {string} sql query string
 */
export const getUserWithRolesSQL = (email: string): string =>
  'SELECT * FROM application_user ' +
  'LEFT JOIN user_role USING (user_id) ' +
  'LEFT JOIN app_role_code USING (role_code_id) ' +
  `WHERE email = '${email.toLowerCase()}';`;
