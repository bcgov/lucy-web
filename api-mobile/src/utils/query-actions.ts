'use strict';

import { getLogger } from './logger';
const defaultLog = getLogger('query-actions');

/**
 * Sends an http response.
 *
 * @param {*} res an http response
 * @param {number} code an http code (200, 404, etc)
 * @param {*} [object] the response data.
 * @returns {*} res an http response
 */
export const sendResponse = function (res: any, code: number, object?: any) {
  defaultLog.debug({ label: 'sendResponse', code, res });

  res.writeHead(code, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(object));
};
