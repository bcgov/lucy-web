'use strict';

import axios from 'axios';
import { RequestHandler } from 'express';
import { Operation } from 'express-openapi';
import { ALL_ROLES } from '../../constants/misc';
// import { uploadFileToS3 } from '../../utils/file-utils';
import { getLogger } from '../../utils/logger';
// import * as geoJSON_Feature_Schema from '../../openapi/geojson-feature-doc.json';

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
  parameters: [
    {
      in: 'path',
      name: 'lon',
      required: true
    },
    {
      in: 'path',
      name: 'lat',
      required: true
    }
  ],
  responses: {
    200: {
      description: 'Elevation value',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              elevation: {
                type: 'integer'
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

    // Grab coordinates from the query string
    const {lon,lat} = req.query;

    // Error if no coordinates
    if (!lon || !lat) {
      throw {
        status: 400,
        message: 'Did not supply valid coordinates'
      }
    }

    defaultLog.debug({ label: 'elevation', message: 'getElevation', body: req.body });

    var url = `https://geogratis.gc.ca/services/elevation/cdem/altitude?lat=${lat}&lon=${lon}`;

    axios.get(url)
      .then((response) => {
        return res.status(200).json({elevation: response.data?.altitude});
      })
      .catch((error) => {
        return defaultLog.debug({ label: 'getElevation', message: 'error', error });
      });
  };
}
