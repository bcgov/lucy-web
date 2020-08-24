/**
 * SQL query to fetch observation aspect codes.
 *
 * @returns {string} sql query string
 */
export const getObservationAspectCodesSQL = (): string => `SELECT * from observation_aspect_code;`;

/**
 * SQL query to fetch jurisdiction codes.
 *
 * @returns {string} sql query string
 */
export const getJurisdictionCodesSQL = (): string => `SELECT * from jurisdiction_code;`;

/**
 * SQL query to fetch observation geometry codes.
 *
 * @returns {string} sql query string
 */
export const getObservationGeometryCodesSQL = (): string => `SELECT * from observation_geometry_code;`;

/**
 * SQL query to fetch observation type codes.
 *
 * @returns {string} sql query string
 */
export const getObservationTypeCodesSQL = (): string => `SELECT * from observation_type_code;`;

/**
 * SQL query to fetch observation proposed action codes.
 *
 * @returns {string} sql query string
 */
export const getObservationProposedActionCodesSQL = (): string => `SELECT * from observation_proposed_action_code;`;

/**
 * SQL query to fetch observation slope codes.
 *
 * @returns {string} sql query string
 */
export const getObservationSlopeCodesSQL = (): string => `SELECT * from observation_slope_code;`;

/**
 * SQL query to fetch texture codes.
 *
 * @returns {string} sql query string
 */
export const getSoilTextureCodesSQL = (): string => `SELECT * from soil_texture_code;`;

/**
 * SQL query to fetch agency codes.
 *
 * @returns {string} sql query string
 */
export const getSpeciesAgencyCodesSQL = (): string => `SELECT * from species_agency_code;`;

/**
 * SQL query to fetch density codes.
 *
 * @returns {string} sql query string
 */
export const getSpeciesDensityCodesSQL = (): string => `SELECT * from species_density_code;`;

/**
 * SQL query to fetch distribution codes.
 *
 * @returns {string} sql query string
 */
export const getSpeciesDistributionCodesSQL = (): string => `SELECT * from species_distribution_code;`;

/**
 * SQL query to fetch species codes.
 *
 * @returns {string} sql query string
 */
export const getSpeciesCodesSQL = (): string => `SELECT * from species;`;

/**
 * SQL query to fetch specific use codes.
 *
 * @returns {string} sql query string
 */
export const getSpecificUseCodesSQL = (): string => `SELECT * from specific_use_code;`;
