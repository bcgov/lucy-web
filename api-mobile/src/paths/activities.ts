'use strict';

import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { SQLStatement } from 'sql-template-strings';
import { ALL_ROLES } from '../constants/misc';
import { getDBConnection } from '../database/db';
import { ActivitySearchCriteria } from '../models/activity';
import geoJSON_Polygon_Schema from '../openapi/geojson-polygon-doc.json';
import { getActivitiesSQL } from '../queries/activity-queries';
import { getLogger } from '../utils/logger';

const defaultLog = getLogger('activity');

export const POST: Operation = [getActivitiesBySearchFilterCriteria()];

POST.apiDoc = {
  description: 'Fetches all activities based on search criteria.',
  tags: ['activity'],
  security: [
    {
      Bearer: ALL_ROLES
    }
  ],
  requestBody: {
    description: 'Activities search filter criteria object.',
    content: {
      'application/json': {
        schema: {
          properties: {
            page: {
              type: 'number',
              default: 0,
              minimum: 0
            },
            limit: {
              type: 'number',
              default: 25,
              minimum: 0,
              maximum: 100
            },
            activity_type: {
              type: 'string'
            },
            activity_subtype: {
              type: 'string'
            },
            date_range_start: {
              type: 'string',
              description: 'Date range start, in YYYY-MM-DD format. Defaults time to start of day.',
              example: '2020-07-30'
            },
            date_range_end: {
              type: 'string',
              description: 'Date range end, in YYYY-MM-DD format. Defaults time to end of day.',
              example: '2020-08-30'
            },
            search_polygon: {
              ...geoJSON_Polygon_Schema
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Activity get response object array.',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                // Don't specify exact response, as it will vary, and is not currently enforced anyways
                // Eventually this could be updated to be a oneOf list, similar to the Post request below.
              }
            }
          }
        }
      }
    },
    401: {
      $ref: '#/components/responses/401'
    },
    503: {
      $ref: '#/components/responses/503'
    },
    default: {
      $ref: '#/components/responses/default'
    }
  }
};

/**
 * Fetches all activity records based on request search filter criteria.
 *
 * @return {RequestHandler}
 */
function getActivitiesBySearchFilterCriteria(): RequestHandler {
  return async (req, res, next) => {
    defaultLog.debug({ label: 'activity', message: 'getActivitiesBySearchFilterCriteria', body: req.body });

    const sanitizedSearchCriteria = new ActivitySearchCriteria(req.body);

    const connection = await getDBConnection();

    if (!connection) {
      throw {
        status: 503,
        message: 'Failed to establish database connection'
      };
    }

    try {
      const sqlStatement: SQLStatement = getActivitiesSQL(sanitizedSearchCriteria);

      if (!sqlStatement) {
        throw {
          status: 400,
          message: 'Failed to build SQL statement'
        };
      }

      const response = await connection.query(sqlStatement.text, sqlStatement.values);

      const result = (response && response.rows) || null;

      return res.status(200).json(result);
    } catch (error) {
      defaultLog.debug({ label: 'getActivitiesBySearchFilterCriteria', message: 'error', error });
      throw error;
    } finally {
      connection.release();
    }
  };
}
