import { BCGeoJSON } from '../bcGeoData';
import { RecordController } from '../generic.data.models';

export class BCGeoDataController extends RecordController<BCGeoJSON> {
    public static get shared(): BCGeoDataController {
        return this.sharedInstance<BCGeoJSON>(BCGeoJSON) as BCGeoDataController;
    }
}
