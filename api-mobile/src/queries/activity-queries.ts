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
  //activityData.locationAndGeometry needs to be added to below:

  const sql =
    'INSERT INTO activity_incoming_data ' +
    '(type, sub_type, received_timestamp, activity_payload) ' +
    'VALUES ($1, $2, $3, $4) ' +
    'RETURNING *;';

  const values = [
    activityData.type,
    activityData.subType,
    activityData.date,
    activityData
  ];

  return { sql, values };
};
