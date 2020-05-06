/**
 * Service Class to consume BCGW WFS service
 */
/**
 * Imports
 */
import * as assert from 'assert';
import * as axios from 'axios';
import { PointTuple, getHTTPReqQueryString } from '../../libs/utilities';
import { LocationConverter, GeoMapUtility, GeoLocation, BaseLogger, DefaultLogger } from '../../libs/utilities';

export const  WFSBasicConfig = {
    SERVICE: 'WFS',
    VERSION: '2.0.0',
    outputFormat: 'json',
    SRSNAME: 'EPSG:4326'
};


export const WFSFeatureConfig = { ...WFSBasicConfig, ...{REQUEST: 'GetFeature'} };

export const url = 'https://openmaps.gov.bc.ca/geo/pub/wfs';

export interface WFSFeature {
    id: string;
    geometry: {
        type: string;
        coordinates: any[];
    };
    properties: {[key: string]: any};
    distance?: number;
    indexOnFeatureSet?: number;
}

export interface WFSResponse {
    type: string;
    features: WFSFeature[];
    totalFeatures: number;
    numberMatched: number;
    numberReturned: number;
}

export class WFSService {
    /**
     * Shared instance
     */
    static _instance: WFSService;
    static get shared(): WFSService {
        return this._instance || ( this._instance = new this());
    }

    /**
     * @description Get Feature set from BCGW with type name
     * @param string typeName
     * @param GeoLocation location
     * @param number distance
     */
    async getFeatures(
        typeName: string,
        location: GeoLocation,
        distance: number,
        baseURL: string = url,
        featureConfig: object = WFSFeatureConfig,
        logger: BaseLogger = DefaultLogger): Promise<any> {
        // Get web mercator for location
        const point: PointTuple = LocationConverter.latLongCoordinateToAlbers(location.latitude, location.longitude);
        // Creating config for query
        const config = {
            typeName: typeName
        };
        const finalConfig = { ...featureConfig, ...config};
        // Query string
        const query = getHTTPReqQueryString(finalConfig);

        // Final url
        // Point String
        const ptStr = `POINT(${Math.round(point.x * 100) / 100} ${Math.round(point.y * 100) / 100})`;
        const finalURL = `${baseURL}${query}&CQL_FILTER=DWITHIN(GEOMETRY,${encodeURIComponent(ptStr)},${distance},meters)`;

        // Calling api
        try {
            const result: axios.AxiosResponse = await axios.default.get(finalURL);
            if (result.data) {
                // Typecase to feature-set
                const features: WFSResponse = result.data as WFSResponse;
                assert(features, `WFSService: getFeatures: Unknown response: ${JSON.stringify(result.data, null, 2)}`);
                return features;
            } else {
                logger.error(`WFSService: getFeatures: Empty response`);
                throw new Error(`WFSService: getFeatures: Empty response`);
            }
        } catch (excp) {
            logger.error(`WFSService: getFeatures: received exception => ${excp}`);
            logger.info(`WFSService: getFeatures: url: ${finalURL}`);
            throw excp;
        }
    }

    async getNearest(
        typeName: string,
        location: GeoLocation,
        distance: number,
        baseURL: string = url,
        featureConfig: object = WFSFeatureConfig,
        logger: BaseLogger = DefaultLogger
    ): Promise<WFSFeature> {
        const result: WFSResponse = await this.getFeatures(typeName, location, distance, baseURL, featureConfig, logger);
        if (result.features.length > 0) {
            let gap = 999999;
            let index = 0;
            let count = 0;
            for (const f of result.features) {
                const coordinates: number[] = f.geometry.coordinates || [0, 0];
                const featureLocation: GeoLocation = {
                    longitude: coordinates[0],
                    latitude: coordinates[1]
                };
                const d = GeoMapUtility.distance(location, featureLocation);
                logger.log(`${featureLocation.longitude}, ${featureLocation.latitude} => ${d}`);
                if (d < gap) {
                    gap = d;
                    index = count;
                }
                count++;
            }
            result.features[index].properties.distance = gap;
            result.features[index].properties.indexOnFeatureSet = index;
            return result.features[index];
        } else {
            logger.error(`WFSService: getNearest: No feature return form url ${baseURL}`);
            return result.features[0];
        }
    }

    async getLayer(typeName: string,
                   baseURL: string = url,
                   featureConfig: object = WFSFeatureConfig,
                   logger: BaseLogger = DefaultLogger): Promise<any> {
        // Creating config for query
        const config = {
            typeName: typeName
        };
        const finalConfig = { ...featureConfig, ...config};
        // Query string
        const query = getHTTPReqQueryString(finalConfig);
        const finalURL = `${baseURL}${query}`;
        try {
            const result: axios.AxiosResponse = await axios.default.get(finalURL);
            if (result.data) {
                return result.data;
            } else {
                logger.error(`WFSService: getLayer: Empty response`);
                throw new Error(`WFSService: getLayer: Empty response`);
            }
        } catch (excp) {
            logger.error(`WFSService: getLayer: received exception => ${excp}`);
            logger.info(`WFSService: getLayer: url: ${finalURL}`);
            throw excp;
        }
    }

    async getLayerInBoundingBox(typeName: string,
                                bbox: string,
                                baseURL: string = url,
                                featureConfig: object = WFSFeatureConfig,
                                logger: BaseLogger = DefaultLogger): Promise<any> {
        const config = {
            typeName: typeName
        };
        const finalConfig = { ...featureConfig, ...config};
        // Query string
        const query = getHTTPReqQueryString(finalConfig);
        const finalURL = `${baseURL}${query}&bbox=${encodeURIComponent(bbox)},epsg:4326`;
        try {
            const result: axios.AxiosResponse = await axios.default.get(finalURL);
            if (result.data) {
                return result.data;
            } else {
                logger.error(`WFSService: getLayerInBoundingBox: Empty response`);
                throw new Error(`WFSService: getLayerInBoundingBox: Empty response`);
            }
        } catch (excp) {
            logger.error(`WFSService: getLayerInBoundaryBox: received exception => ${excp}`);
            logger.info(`WFSService: getLayerInBoundingBox: url: ${finalURL}`);
            throw excp;
        }
    }
}
 // -----------------------------------------
