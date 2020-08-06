'use strict';

import { ParameterizedQuery } from '../queries/query-types';
import { getDBConnection } from '../database/db';
import { getAllObservationPlantSQL, getSingleObservationPlantSQL } from '../queries/observation-queries';
import { getLogger } from '../utils/logger';
import { sendResponse } from '../utils/query-actions';

const defaultLog = getLogger('observation-plant-controller');

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
 * Authenticated route handler for GET
 *
 * @param {*} args
 * @param {*} res
 * @param {*} next
 * @returns response containing an array of all observations, or an empty array if none found.
 */
exports.authenticatedGet_All = async function (args: any, res: any, next: any) {
  defaultLog.debug({ label: 'authenticatedGet', message: 'params', arguments: args.swagger.params });

  const connection = await getDBConnection();

  if (!connection) {
    return sendResponse(res, 503);
  }

  const response = await connection.query(getAllObservationPlantSQL());

  const result = (response && response.rowCount && response.rows[0]) || [];

  connection.release();

  return sendResponse(res, 200, result);
};

/**
 * Authenticated route handler for GET
 *
 * @param {*} args
 * @param {*} res
 * @param {*} next
 * @returns response containing the single observation found, or null if no matching observation found.
 */
exports.authenticatedGet_One = async function (args: any, res: any, next: any) {
  defaultLog.debug({ label: 'authenticatedGet', message: 'params', arguments: args.swagger.params });

  const observationId = args.swagger.params.observationId.value;

  const connection = await getDBConnection();

  if (!connection) {
    return sendResponse(res, 503);
  }

  const parameterizedQuery: ParameterizedQuery = getSingleObservationPlantSQL(observationId);

  if (!parameterizedQuery) {
    return sendResponse(res, 400);
  }

  const response = await connection.query(parameterizedQuery.sql, parameterizedQuery.values);

  const result = (response && response.rowCount && response.rows[0]) || null;

  connection.release();

  return sendResponse(res, 200, result);
};
