// ** SpaceGeomController ** //

import { RecordController } from '../generic.data.models';
import { SpaceGeom} from '../../models';
import { SpaceGeomSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for SpaceGeomSchema and SpaceGeom
 */
export class SpaceGeomController extends RecordController<SpaceGeom> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SpaceGeomController {
		return this.sharedInstance<SpaceGeom>(SpaceGeom, SpaceGeomSchema) as SpaceGeomController;
	}
}
// ----------------
