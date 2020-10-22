'use strict';

import { ManagedUpload } from 'aws-sdk/clients/s3';
import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { SQLStatement } from 'sql-template-strings';
import { ALL_ROLES, WRITE_ROLES } from '../constants/misc';
import { getDBConnection } from '../database/db';
import { ActivityPostRequestBody, ActivitySearchCriteria, IMediaItem, MediaBase64 } from '../models/activity';
import { getActivitiesSQL, postActivitySQL } from '../queries/activity-queries';
import { uploadFileToS3 } from '../utils/file-utils';
import { getLogger } from '../utils/logger';
import * as geoJSON_Feature_Schema from '../openapi/geojson-feature-doc.json';

const defaultLog = getLogger('activity');

export const GET: Operation = [getElevation()];

GET.apiDoc = {
  description: 'Fetches elevation for a single point',
  tags: ['activity','elevation'],
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
            // GeoJson Bounding Box
            bbox: {
              type: 'array',
              minItems: 4,
              items: {
                type: 'number'
              }
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
function getElevation(): RequestHandler {
  return async (req, res, next) => {
    defaultLog.debug({ label: 'activity', message: 'getElevation', body: req.body });
    console.log(req);
    var url = 'http://geogratis.gc.ca/services/elevation/cdem/altitude?lat=45.5&lon=-71.5';

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
      defaultLog.debug({ label: 'getElevation', message: 'error', error });
      throw error;
    } finally {
      connection.release();
    }
  };
}
