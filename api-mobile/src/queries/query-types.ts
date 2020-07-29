/**
 * Return value type for building parameterized sql queries.
 *
 * @export
 * @class IQuery
 */
export class ParameterizedQuery {
  sql: string;
  values: any[];
}
