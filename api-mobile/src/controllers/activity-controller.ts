'use strict';

import { getDBConnection } from '../database/db';
import { ActivityPostBody } from '../models/activity';
import { postActivitySQL } from '../queries/activity-queries';
import { getLogger } from '../utils/logger';
import { sendResponse } from '../utils/query-actions';
import { ParameterizedQuery } from '../queries/query-types';
import * as SwaggerValidator from 'swagger-object-validator';



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
  try {

  defaultLog.debug({ label: 'authenticatedPost', message: 'params', arguments: args.swagger.params });
  let validator = new SwaggerValidator.Handler('./src/swagger/swagger.yaml')

  validator.validateModel(args.swagger.params.postBody.value, 'ActivityPostBody', (err:any, result: any ) => {
      console.log(result.humanReadable());
  });

  const data: ActivityPostBody = args.swagger.params.postBody.value;

  const sanitizedActivityData = new ActivityPostBody(data);

  const connection = await getDBConnection();

  if (!connection) {
    return sendResponse(res, 503);
  }

  const parameterizedQuery: ParameterizedQuery = postActivitySQL(sanitizedActivityData);

  if (!parameterizedQuery) {
    return sendResponse(res, 400);
  }

  const response = await connection.query(parameterizedQuery.sql, parameterizedQuery.values);

  const result = (response && response.rows && response.rows[0]) || null;

  connection.release();

  return sendResponse(res, 200, result);
  } catch (error) {
    console.log(error.message)
    }
};
