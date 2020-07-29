'use strict';

import { getDBConnection } from '../database/db';
import { getUserWithRolesSQL } from '../queries/user-queries';

import { getLogger } from '../utils/logger';
const defaultLog = getLogger('user-controller');

/**
 * Finds a single user based on their email.
 *
 * @param {string} email
 * @returns user
 */
export const getUserWithRoles = async function (email: string) {
  defaultLog.debug({ label: 'getUserWithRoles', message: 'params', email });

  if (!email) {
    return null;
  }

  const connection = await getDBConnection();

  if (!connection) {
    return null;
  }

  const response = await connection.query(getUserWithRolesSQL(email));

  const result = (response && response.rowCount && response.rows[0]) || null;

  connection.release();

  return result;
};
