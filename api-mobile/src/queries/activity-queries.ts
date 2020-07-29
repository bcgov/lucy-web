import { ActivityPostBody } from '../models/activity';

/**
 * SQL query to insert a new activity, and return the inserted record.
 *
 * @param {ActivityPostBody} activityData
 * @returns {string} sql query string
 */
// TODO finalize table/column names and update query to set new fields
export const postActivitySQL = (activityData: ActivityPostBody): string =>
  'INSERT INTO api_audit_and_staging ' +
  '(type, sub_type, date, location_and_geometry, data) VALUES ' +
  `('${activityData.type}', '${activityData.subType}', '${activityData.date}', '${JSON.stringify(
    activityData.locationAndGeometry
  )}', '${JSON.stringify(activityData.data)}')` +
  'RETURNING *';
