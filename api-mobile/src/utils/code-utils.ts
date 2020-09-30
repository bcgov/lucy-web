import { PoolClient } from 'pg';
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

export interface IAllCodeSets {
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
}

/**
 * Function that fetches all code sets.
 *
 * @param {PoolClient} connection
 * @returns {IAllCodeSets} an object containing all code sets
 */
export async function getAllCodeSets(connection: PoolClient): Promise<IAllCodeSets> {
  if (!connection) {
    return null;
  }

  const result: IAllCodeSets = {
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
  };

  // Fetch all observation codes
  const observation_aspect_code = await connection.query(getObservationAspectCodesSQL().text);
  const jurisdiction_code = await connection.query(getJurisdictionCodesSQL().text);
  const observation_geometry_code = await connection.query(getObservationGeometryCodesSQL().text);
  const observation_type_code = await connection.query(getObservationTypeCodesSQL().text);
  const observation_proposed_action_code = await connection.query(getObservationProposedActionCodesSQL().text);
  const observation_slope_code = await connection.query(getObservationSlopeCodesSQL().text);
  const soil_texture_code = await connection.query(getSoilTextureCodesSQL().text);
  const species_agency_code = await connection.query(getSpeciesAgencyCodesSQL().text);
  const species_density_code = await connection.query(getSpeciesDensityCodesSQL().text);
  const species_distribution_code = await connection.query(getSpeciesDistributionCodesSQL().text);
  const species = await connection.query(getSpeciesCodesSQL().text);
  const specific_use_code = await connection.query(getSpecificUseCodesSQL().text);

  // Add code responses to results object
  result.observation_aspect_code = (observation_aspect_code && observation_aspect_code.rows) || [];
  result.jurisdiction_code = (jurisdiction_code && jurisdiction_code.rows) || [];
  result.observation_geometry_code = (observation_geometry_code && observation_geometry_code.rows) || [];
  result.observation_type_code = (observation_type_code && observation_type_code.rows) || [];
  result.observation_proposed_action_code =
    (observation_proposed_action_code && observation_proposed_action_code.rows) || [];
  result.observation_slope_code = (observation_slope_code && observation_slope_code.rows) || [];
  result.soil_texture_code = (soil_texture_code && soil_texture_code.rows) || [];
  result.species_agency_code = (species_agency_code && species_agency_code.rows) || [];
  result.species_density_code = (species_density_code && species_density_code.rows) || [];
  result.species_distribution_code = (species_distribution_code && species_distribution_code.rows) || [];
  result.species = (species && species.rows) || [];
  result.specific_use_code = (specific_use_code && specific_use_code.rows) || [];

  return result;
}
