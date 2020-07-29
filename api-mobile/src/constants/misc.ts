/**
 * Caching keys, for use with `memory-cache`.
 *
 * @export
 * @enum {number}
 */
export enum CacheKeys {
  ObservationCodePlant = 'observationCodePlant'
}

/**
 * Supported activity types.
 *
 * @export
 * @enum {number}
 */
export enum ActivityType {
  Plant = 'plant',
  Animal = 'animal'
}

/**
 * Supported activity sub types.
 *
 * @export
 * @enum {number}
 */
export enum ActivitySubType {
  Terrestrial = 'terrestrial',
  Aquatic = 'aquatic'
}
