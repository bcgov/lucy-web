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

  // Geometry needs to be stringified. Postgresql doesn't know to cast
  // GeoJSON into a string... Even though it works for a regular JSON field.
  const geometry = JSON.stringify(activityData.locationAndGeometry['geometry']);

  // Formulate the sql statement
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
      ST_Force2D(
        public.ST_Transform(
          public.ST_SetSRID(
            public.ST_GeomFromGeoJSON($5)
            ,4326)
          ,3005
        )
      )
    )
    RETURNING
      activity_incoming_data_id
  `;

  // Data to be passed
  const values = [
    activityData.activityType,
    activityData.activitySubType,
    activityData.date,
    activityData.activityPostBody,
    geometry
  ];

  return { sql, values };
};
