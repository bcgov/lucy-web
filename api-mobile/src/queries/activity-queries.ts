import { ActivityPostBody } from '../models/activity';
import { SQL, SQLStatement } from 'sql-template-strings';

/**
 * SQL query to insert a new activity, and return the inserted record.
 *
 * @param {ActivityPostBody} activityData
 * @returns {SQLStatement} sql query object
 */
export const postActivitySQL = (activityData: ActivityPostBody): SQLStatement => {
  if (!activityData) {
    return null;
  }

  return SQL`
    INSERT INTO activity_incoming_data (
      activity_type,
      activity_sub_type,
      received_timestamp,
      activity_payload,
      geog,
      media_keys
    ) VALUES (
      ${activityData.activityType},
      ${activityData.activitySubType},
      ${activityData.date},
      ${activityData.activityPostBody},
      public.ST_Force2D(
        public.ST_SetSRID(
          public.ST_GeomFromGeoJSON(${JSON.stringify(activityData.locationAndGeometry['geometry'])})
          ,4326
        )
      )::geography,
      ${activityData.mediaKeys}
    )
    RETURNING
      activity_incoming_data_id;
  `;
};
