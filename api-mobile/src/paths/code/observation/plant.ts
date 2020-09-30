import { Operation } from 'express-openapi';
import { ALL_ROLES, CacheKeys } from '../../../constants/misc';
import { getDBConnection } from '../../../database/db';
import { getAllCodeSets } from '../../../utils/code-utils';
import { getLogger } from '../../../utils/logger';
import { cached } from '../../../utils/utils';

const defaultLog = getLogger('observation-controller');

export const GET: Operation = [
  async (req, res, next) => {
    defaultLog.debug({ label: 'code-observation-plant' });

    const connection = await getDBConnection();

    if (!connection) {
      throw {
        status: 503,
        message: 'Failed to establish database connection'
      };
    }

    const result = await cached(CacheKeys.ObservationCodePlant, 3600000, () => getAllCodeSets(connection))();

    connection.release();

    res.status(200).json(result);
  }
];

GET.apiDoc = {
  description: 'Get all observation plant code values.',
  tags: ['code'],
  security: [
    {
      Bearer: ALL_ROLES
    }
  ],
  responses: {
    200: {
      description: 'Code values for a plant observation',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ObservationCodeResponse'
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
