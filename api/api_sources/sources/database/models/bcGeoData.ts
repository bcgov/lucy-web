import { Record } from './generic.data.models';
import { ModelProperty, PropertyType } from '../../libs/core-model';

export interface BCGeoJSONSpec {
    type: string;
    features: [any];
}

export class BCGeoJSON extends Record implements BCGeoJSONSpec {
    @ModelProperty({ type: PropertyType.string})
    type: string;

    @ModelProperty({ type: PropertyType.array})
    features: [any];
}
