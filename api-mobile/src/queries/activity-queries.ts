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

  const sql = `
    INSERT INTO activity_incoming_data (
      activity_type,
      activity_sub_type,
      received_timestamp,
      activity_payload,
      geom
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON($5),4326),3005)
    )
    RETURNING
      activity_incoming_data_id
  `;

  const values = [
    activityData.activityType,
    activityData.activitySubType,
    activityData.date,
    activityData.activityPostBody,
    activityData.locationAndGeometry['geometry']
  ];

  return { sql, values };
};
