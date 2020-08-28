'use strict';

import { getDBConnection } from '../database/db';
import { ActivityPostBody } from '../models/activity';
import { postActivitySQL } from '../queries/activity-queries';
import { ParameterizedQuery } from '../queries/query-types';
import { validateSwaggerObject, ignoreAdditionalPropertyErrorsOnAnyObjectFields } from '../utils/controller-utils';
import { getLogger } from '../utils/logger';
import { sendResponse } from '../utils/query-actions';

const defaultLog = getLogger('activity-controller');

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
  try {
    defaultLog.debug({ label: 'authenticatedPost', message: 'params', arguments: args.swagger.params });

    const validationResult = await validateSwaggerObject(
      args.swagger.params.postBody.value,
      'ActivityPostBody',
      './src/swagger/swagger.yaml',
      ignoreAdditionalPropertyErrorsOnAnyObjectFields
    );

    if (validationResult.errors) {
      defaultLog.warn({
        label: 'authenticatedPost',
        message: validationResult.message,
        'post body params were invalid': validationResult.errors
      });
      return sendResponse(res, 400, { 'post body params were invalid': validationResult.errors });
    }

    const data: ActivityPostBody = args.swagger.params.postBody.value;

    const sanitizedActivityData = new ActivityPostBody(data);
    sanitizedActivityData.activityPostBody = args.swagger.params.postBody.value;

    const connection = await getDBConnection();

    if (!connection) {
      return sendResponse(res, 503);
    }

    const parameterizedQuery: ParameterizedQuery = postActivitySQL(sanitizedActivityData);

    if (!parameterizedQuery) {
      return sendResponse(res, 400);
    }

    const response = await connection.query(parameterizedQuery.sql, parameterizedQuery.values);
    // const response = await connection.query(parameterizedQuery.sql);

    const result = (response && response.rows && response.rows[0]) || null;

    connection.release();

    return sendResponse(res, 200, result);
  } catch (error) {
    defaultLog.error({ label: 'authenticatedPost', message: 'unexpected error', error });
    return sendResponse(res, 500);
  }
};
