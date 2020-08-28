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

  // const sql = `
  //   INSERT INTO activity_incoming_data (
  //     activity_type,
  //     activity_sub_type,
  //     received_timestamp,
  //     activity_payload,
  //     geom
  //   ) VALUES (
  //     '$1',
  //     '$2',
  //     '$3',
  //     '$4',
  //     ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('$5'),4326),3005)
  //   )
  //   RETURNING
  //     activity_incoming_data_id
  // `;
  // const testing = `{
  //     "type": "Polygon",
  //     "coordinates": [
  //       [
  //         [-125.6, 48.3],[-126.6, 48.3],[-126.6, 49.3],[-125.6, 48.3]
  //       ]
  //     ]
  //   }`;

  const geometry = JSON.stringify(activityData.locationAndGeometry['geometry']);

  const sql = `
    INSERT INTO activity_incoming_data (
      activity_type,
      activity_sub_type,
      received_timestamp,
      activity_payload,
      geom
    ) VALUES (
      '${activityData.activityType}',
      '${activityData.activitySubType}',
      '${activityData.date}',
      '${JSON.stringify(activityData.activityPostBody)}',
      public.st_transform(public.st_setSrid(public.ST_geomFromGeoJSON('${geometry}'),4326),3005)
    )
    RETURNING
      activity_incoming_data_id
  `;


  console.log(sql);
  // console.log(JSON.stringify(activityData.locationAndGeometry['geometry'], undefined, 4));

  const values = [
    activityData.activityType,
    activityData.activitySubType,
    activityData.date,
    activityData.activityPostBody
    // activityData.locationAndGeometry['geometry']
  ];

  return { sql, values };
};
