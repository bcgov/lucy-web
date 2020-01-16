/**
 * Test for WFSService
 */
import { should } from 'chai';
import { WFSService, WFSResponse, WFSFeature } from './wfs.service';
import { GeoLocation } from '../../libs/utilities';
import { BCGWFeatures } from './bcgov.const';

describe.skip('Test for WFSService', () => {
    it('should pull feature data from bcgw wfs', async () => {
        const loc: GeoLocation = {
            latitude: 48.424578999999994,
            longitude: -123.36466990000001
        };
        const d = 1000;
        const typeName = 'WHSE_WATER_MANAGEMENT.GW_WATER_WELLS_WRBC_SVW';
        const r: WFSResponse = await WFSService.shared.getFeatures(typeName, loc, d);
        should().exist(r);
        should().exist(r.features);
        should().exist(r.type);
        should().exist(r.totalFeatures);
    });

    it('should pull nearest feature data from bcgw wfs', async () => {
        const loc: GeoLocation = {
            latitude: 48.424578999999994,
            longitude: -123.36466990000001
        };
        const d = 750;
        const typeName = BCGWFeatures.well;
        const r: WFSFeature = await WFSService.shared.getNearest(typeName, loc, d);
        should().exist(r);
        should().exist(r.id);
        should().exist(r.geometry);
        should().exist(r.properties);
        should().exist(r.properties.distance);
    });
});
// ---------------------------
