import { ActivityPostBody } from '../models/activity';
import { ParameterizedQuery } from './query-types';

/**
 * SQL query to insert a new activity, and return the inserted record.
 *
 * @param {ActivityPostBody} activityData
 * @returns {ParameterizedQuery} sql parameterized query object
 */
export const postActivitySQL = (activityData: ActivityPostBody): ParameterizedQuery => {
  if (!activityData) {
    return null;
  }

  const sql =
    'INSERT INTO api_audit_and_staging ' +
    '(type, sub_type, date, location_and_geometry, data) ' +
    'VALUES ($1, $2, $3, $4, $5) ' +
    'RETURNING *;';

  const values = [
    activityData.type,
    activityData.subType,
    activityData.date,
    activityData.locationAndGeometry,
    activityData
  ];

  return { sql, values };
};
