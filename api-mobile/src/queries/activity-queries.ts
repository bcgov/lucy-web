import { SQL, SQLStatement } from 'sql-template-strings';
import { ActivityPostRequestBody, ActivitySearchCriteria } from './../models/activity';

/**
 * SQL query to insert a new activity, and return the inserted record.
 *
 * @param {ActivityPostRequestBody} activity
 * @returns {SQLStatement} sql query object
 */
export const postActivitySQL = (activity: ActivityPostRequestBody): SQLStatement => {
  if (!activity) {
    return null;
  }

  const sqlStatement: SQLStatement = SQL`
    INSERT INTO activity_incoming_data (
      activity_type,
      activity_subtype,
      received_timestamp,
      activity_payload,
      geog,
      media_keys
    ) VALUES (
      ${activity.activity_type},
      ${activity.activity_subtype},
      ${activity.received_timestamp},
      ${activity.activityPostBody}
  `;

  if (activity.geoJSONFeature && activity.geoJSONFeature.length) {
    // Note: this is only saving the `geometry` part of the feature, and not any assocaited `properties`.
    const geometry = JSON.stringify(activity.geoJSONFeature[0].geometry);

    sqlStatement.append(SQL`
      ,public.geography(
        public.ST_Force2D(
          public.ST_SetSRID(
            public.ST_GeomFromGeoJSON(${geometry}),
            4326
          )
        )
      )
    `);
  } else {
    sqlStatement.append(SQL`
      ,null
    `);
  }

  if (activity.mediaKeys) {
    sqlStatement.append(SQL`
      ,${activity.mediaKeys}
    `);
  } else {
    sqlStatement.append(SQL`
      ,null
    `);
  }

  sqlStatement.append(SQL`
    )
    RETURNING
      activity_incoming_data_id;
  `);

  return sqlStatement;
};

/**
 * SQL query to fetch activity records based on search criteria.
 *
 * @param {ActivitySearchCriteria} searchCriteria
 * @returns {SQLStatement} sql query object
 */
export const getActivitiesSQL = (searchCriteria: ActivitySearchCriteria): SQLStatement => {
  const sqlStatement: SQLStatement = SQL`SELECT * FROM activity_incoming_data WHERE 1 = 1`;

  if (searchCriteria.activity_type) {
    sqlStatement.append(SQL` AND activity_type = ${searchCriteria.activity_type}`);
  }

  if (searchCriteria.activity_subtype) {
    sqlStatement.append(SQL` AND activity_subtype = ${searchCriteria.activity_subtype}`);
  }

  if (searchCriteria.date_range_start) {
    sqlStatement.append(SQL` AND received_timestamp >= ${searchCriteria.date_range_start}::DATE`);
  }

  if (searchCriteria.date_range_end) {
    sqlStatement.append(SQL` AND received_timestamp <= ${searchCriteria.date_range_end}::DATE`);
  }

  if (searchCriteria.search_polygon) {
    sqlStatement.append(SQL`
      AND public.ST_INTERSECTS(
        geog,
        public.geography(
          public.ST_Force2D(
            public.ST_SetSRID(
              public.ST_GeomFromGeoJSON(${searchCriteria.search_polygon}),
              4326
            )
          )
        )
      )
    `);
  }

  if (searchCriteria.limit) {
    sqlStatement.append(SQL` LIMIT ${searchCriteria.limit}`);
  }

  if (searchCriteria.limit) {
    sqlStatement.append(SQL` OFFSET ${searchCriteria.page}`);
  }

  sqlStatement.append(SQL`;`);

  return sqlStatement;
};

/**
 * SQL query to fetch a single activity record based on its primary key.
 *
 * @param {number} activityId
 * @returns {SQLStatement} sql query object
 */
export const getActivitySQL = (activityId: number): SQLStatement => {
  return SQL`SELECT * FROM activity_incoming_data where activity_incoming_data_id = ${activityId}`;
};
