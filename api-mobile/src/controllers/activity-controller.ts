'use strict';

import { getDBConnection } from '../database/db';
import { ActivityPostBody } from '../models/activity';
import { postActivitySQL } from '../queries/activity-queries';
import { getLogger } from '../utils/logger';
import { sendResponse } from '../utils/query-actions';

const defaultLog = getLogger('observation-controller');

/**
 * Authenticated route handler for OPTIONS
 *
 * @param {*} args
 * @param {*} res
 * @param {*} next
 */
exports.authenticatedOptions = async function (args: any, res: any, next: any) {
  res.status(200).send();
};

/**
 * Authenticated route handler for POST
 *
 * @param {*} args
 * @param {*} res
 * @param {*} next
 * @returns response containing the newly created activity record.
 */
exports.authenticatedPost = async function (args: any, res: any, next: any) {
  defaultLog.debug({ label: 'authenticatedPost', message: 'params', arguments: args.swagger.params });

  const data: ActivityPostBody = args.swagger.params.postBody.value;

  const sanitizedActivityData = new ActivityPostBody(data);

  const connection = await getDBConnection();

  if (!connection) {
    return sendResponse(res, 503);
  }

  const sql = postActivitySQL(sanitizedActivityData);

  const response = await connection.query(sql);

  const result = (response && response.rows && response.rows[0]) || null;

  connection.release();

  return sendResponse(res, 200, result);
};
