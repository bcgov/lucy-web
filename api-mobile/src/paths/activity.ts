'use strict';

import { ManagedUpload } from 'aws-sdk/clients/s3';
import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { SQLStatement } from 'sql-template-strings';
import { WRITE_ROLES } from '../constants/misc';
import { getDBConnection } from '../database/db';
import { ActivityPostBody, IMediaItem, MediaBase64 } from '../models/activity';
import { postActivitySQL } from '../queries/activity-queries';
import { uploadFileToS3 } from '../utils/file-utils';
import { getLogger } from '../utils/logger';

const defaultLog = getLogger('activity-controller');

export const POST: Operation = [uploadMedia(), createActivity()];

POST.apiDoc = {
  description: 'Create a new activity.',
  tags: ['activity'],
  security: [
    {
      Bearer: WRITE_ROLES
    }
  ],
  requestBody: {
    description: 'Activity post response object.',
    content: {
      'application/json': {
        schema: {
          required: [
            'activityType',
            'activityTypeData',
            'activitySubType',
            'activitySubTypeData',
            'date',
            'locationAndGeometry'
          ],
          properties: {
            activityType: {
              type: 'string'
            },
            activityTypeData: {
              type: 'object'
            },
            activitySubType: {
              type: 'string'
            },
            activitySubTypeData: {
              type: 'object'
            },
            date: {
              type: 'string',
              description: 'Date in YYYY-MM-DD format'
            },
            locationAndGeometry: {
              type: 'object',
              properties: {
                anchorPointY: {
                  type: 'number'
                },
                anchorPointX: {
                  type: 'number'
                },
                area: {
                  type: 'number'
                },
                geometry: {
                  type: 'object',
                  description: 'A geoJSON object'
                },
                jurisdiction: {
                  type: 'string'
                },
                agency: {
                  type: 'string'
                },
                observer1FirstName: {
                  type: 'string'
                },
                observer1LastName: {
                  type: 'string'
                },
                locationComment: {
                  type: 'string'
                },
                generalComment: {
                  type: 'string'
                },
                photoTaken: {
                  type: 'boolean'
                }
              }
            },
            media: {
              description: 'The keys for the uploaded files',
              type: 'array',
              items: {
                type: 'object',
                required: ['fileName', 'encodedFile'],
                properties: {
                  fileName: {
                    type: 'string'
                  },
                  encodedFile: {
                    type: 'string',
                    format: 'base64',
                    description: 'A Data URL base64 encoded image',
                    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4REy...'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Activity post response object.',
      content: {
        'application/json': {
          schema: {
            required: ['activity_incoming_data_id'],
            properties: {
              activity_incoming_data_id: {
                type: 'number'
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
 * Uploads any media in the request to S3, adding their keys to the request, and calling next().
 *
 * Does nothing if no media is present in the request.
 *
 * @returns {RequestHandler}
 */
function uploadMedia(): RequestHandler {
  return async (req, res, next) => {
    if (!req.body.media || !req.body.media.length) {
      // no media objects included, skipping media upload step
      return next();
    }

    const rawMediaArray: IMediaItem[] = req.body.media;

    const s3UploadPromises: Promise<ManagedUpload.SendData>[] = [];

    rawMediaArray.forEach((rawMedia: IMediaItem) => {
      if (!rawMedia) {
        return;
      }

      let media;
      try {
        media = new MediaBase64(rawMedia);
      } catch (error) {
        throw {
          status: 400,
          message: 'Included media was invalid/encoded incorrectly'
        };
      }

      const metadata = {
        filename: media.fileName,
        username: (req['auth_payload'] && req['auth_payload'].preferred_username) || '',
        email: (req['auth_payload'] && req['auth_payload'].email) || ''
      };

      s3UploadPromises.push(uploadFileToS3(media, metadata));
    });

    const results = await Promise.all(s3UploadPromises);

    req['mediaKeys'] = results.map(result => result.Key);

    next();
  };
}

/**
 * Creates a new activity record.
 *
 * @returns {RequestHandler}
 */
function createActivity(): RequestHandler {
  return async (req, res, next) => {
    defaultLog.debug({ label: 'activity', message: 'body', body: req.body });

    const data: ActivityPostBody = { ...req.body, mediaKeys: req['mediaKeys'] };

    const sanitizedActivityData = new ActivityPostBody(data);

    const connection = await getDBConnection();

    if (!connection) {
      throw {
        status: 503
      };
    }

    const sqlStatement: SQLStatement = postActivitySQL(sanitizedActivityData);

    if (!sqlStatement) {
      throw {
        status: 400
      };
    }

    const response = await connection.query(sqlStatement.text, sqlStatement.values);

    const result = (response && response.rows && response.rows[0]) || null;

    connection.release();

    return res.status(200).json(result);
  };
}
