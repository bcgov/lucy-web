import { ParameterizedQuery } from '../queries/query-types';

/**
 * SQL query to fetch a user and their associated role.
 *
 * @param {string} email user email
 * @returns {string} sql query string
 */
export const getUserWithRolesSQL = (email: string): ParameterizedQuery => {
  if (!email) {
    return null;
  }

  const sql =
    'SELECT * FROM application_user ' +
    'LEFT JOIN user_role USING (user_id) ' +
    'LEFT JOIN app_role_code USING (role_code_id) ' +
    'WHERE email = $1;';

  const values = [email.toLowerCase()];

  return { sql, values };
};
