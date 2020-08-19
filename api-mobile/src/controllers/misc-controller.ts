'use strict';

import { getLogger } from '../utils/logger';
import { sendResponse } from '../utils/query-actions';

const defaultLog = getLogger('misc-controller');

/**
 * Public route handler for OPTIONS
 *
 * @param {*} args
 * @param {*} res
 * @param {*} next
 */
exports.publicOptions = async function (args: any, res: any, next: any) {
  res.status(200).send();
};

/**
 * Public route handler for GET.
 *
 * @param {*} args
 * @param {*} res
 * @param {*} next
 * @returns response with api-mobile version information.
 */
exports.publicGet = async function (args: any, res: any, next: any) {
  defaultLog.debug({ label: 'publicGet', message: 'params', arguments: args.swagger.params });

  const versionInfo = {
    version: process.env.VERSION || '0',
    environment: process.env.environment || process.env.NODE_ENV || 'localhost'
  };

  return sendResponse(res, 200, versionInfo);
};
