'use strict';

import { PoolClient } from 'pg';
import { getDBConnection } from '../database/db';
import {
  getJurisdictionCodesSQL,
  getObservationAspectCodesSQL,
  getObservationGeometryCodesSQL,
  getObservationProposedActionCodesSQL,
  getObservationSlopeCodesSQL,
  getObservationTypeCodesSQL,
  getSoilTextureCodesSQL,
  getSpeciesAgencyCodesSQL,
  getSpeciesCodesSQL,
  getSpeciesDensityCodesSQL,
  getSpeciesDistributionCodesSQL,
  getSpecificUseCodesSQL
} from '../queries/code-queries';
import { getLogger } from '../utils/logger';
import { sendResponse } from '../utils/query-actions';
import { cached } from '../utils/utils';
import { CacheKeys } from '../constants/misc';

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
 * Authenticated route handler for GET: observation plant codes
 *
 * @param {*} args
 * @param {*} res
 * @param {*} next
 * @returns response with an object containing arrays of all of the code values related to plant observations.
 */
exports.authenticatedGet_ObservationPlant = async function (args: any, res: any, next: any) {
  defaultLog.debug({ label: 'authenticatedGet', message: 'params', arguments: args.swagger.params });

  const connection = await getDBConnection();

  if (!connection) {
    return sendResponse(res, 503);
  }

  const result = await cached(CacheKeys.ObservationCodePlant, 3600000, () =>
    getCodesForPlantObservations(connection)
  )();

  connection.release();

  return sendResponse(res, 200, result);
};

/**
 * Fetch all code values for plant observations.
 *
 * @param {PoolClient} connection
 * @returns {Promise<object>}
 */
export const getCodesForPlantObservations = async function (connection: PoolClient): Promise<object> {
  if (!connection) {
    return null;
  }

  const result: {
    message: string;
    data: {
      observation_aspect_code: object;
      jurisdiction_code: object;
      observation_geometry_code: object;
      observation_type_code: object;
      observation_proposed_action_code: object;
      observation_slope_code: object;
      soil_texture_code: object;
      species_agency_code: object;
      species_density_code: object;
      species_distribution_code: object;
      species: object;
      specific_use_code: object;
    };
  } = {
    message: 'observation codes',
    data: {
      observation_aspect_code: [],
      jurisdiction_code: [],
      observation_geometry_code: [],
      observation_type_code: [],
      observation_proposed_action_code: [],
      observation_slope_code: [],
      soil_texture_code: [],
      species_agency_code: [],
      species_density_code: [],
      species_distribution_code: [],
      species: [],
      specific_use_code: []
    }
  };

  // Fetch all observation codes
  const observation_aspect_code = await connection.query(getObservationAspectCodesSQL());
  const jurisdiction_code = await connection.query(getJurisdictionCodesSQL());
  const observation_geometry_code = await connection.query(getObservationGeometryCodesSQL());
  const observation_type_code = await connection.query(getObservationTypeCodesSQL());
  const observation_proposed_action_code = await connection.query(getObservationProposedActionCodesSQL());
  const observation_slope_code = await connection.query(getObservationSlopeCodesSQL());
  const soil_texture_code = await connection.query(getSoilTextureCodesSQL());
  const species_agency_code = await connection.query(getSpeciesAgencyCodesSQL());
  const species_density_code = await connection.query(getSpeciesDensityCodesSQL());
  const species_distribution_code = await connection.query(getSpeciesDistributionCodesSQL());
  const species = await connection.query(getSpeciesCodesSQL());
  const specific_use_code = await connection.query(getSpecificUseCodesSQL());

  // Add code responses to results object
  result.data.observation_aspect_code = (observation_aspect_code && observation_aspect_code.rows) || [];
  result.data.jurisdiction_code = (jurisdiction_code && jurisdiction_code.rows) || [];
  result.data.observation_geometry_code = (observation_geometry_code && observation_geometry_code.rows) || [];
  result.data.observation_type_code = (observation_type_code && observation_type_code.rows) || [];
  result.data.observation_proposed_action_code =
    (observation_proposed_action_code && observation_proposed_action_code.rows) || [];
  result.data.observation_slope_code = (observation_slope_code && observation_slope_code.rows) || [];
  result.data.soil_texture_code = (soil_texture_code && soil_texture_code.rows) || [];
  result.data.species_agency_code = (species_agency_code && species_agency_code.rows) || [];
  result.data.species_density_code = (species_density_code && species_density_code.rows) || [];
  result.data.species_distribution_code = (species_distribution_code && species_distribution_code.rows) || [];
  result.data.species = (species && species.rows) || [];
  result.data.specific_use_code = (specific_use_code && specific_use_code.rows) || [];

  return result;
};
