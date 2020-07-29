import { ParameterizedQuery } from './query-types';

/**
 * SQL query to fetch all plant observations.
 *
 * @returns {string} sql query string
 */
export const getAllObservationPlantSQL = (): string => `SELECT * FROM observation;`;

/**
 * SQL query to fetch a single plant observation.
 *
 * @param {string} observationId observation primary key
 * @returns {string} sql query string
 */
export const getSingleObservationPlantSQL = (observationId: string): ParameterizedQuery => {
  if (!observationId) {
    return null;
  }

  const sql = 'SELECT * FROM observation WHERE observation_id = $1;';

  const values = [observationId];

  return { sql, values };
};
