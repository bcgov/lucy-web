// ** SpaceGeomController ** //

import { RecordController } from '../generic.data.models';
import { SpaceGeom} from '../../models';
import { SpaceGeomSchema } from '../../database-schema';
import { User } from '../user';
import { LocationConverter } from '../../../libs/utilities';


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

	async createNewObject(spec: SpaceGeom, creator: User, ...other: any[]): Promise<any> {
		const newObj: SpaceGeom = this.newObject(spec);
		const hexIds = await LocationConverter.getHexId(spec.longitude, spec.latitude);
		newObj.hexId = `${hexIds.cc}`;
		newObj.createdBy = creator;
		newObj.updatedBy = creator;
		try {
            await this.saveInDB(newObj);
            return newObj;
        } catch (excp) {
            throw excp;
        }
	}

	async updateObject(existing: SpaceGeom, update: SpaceGeom, modifier: User): Promise<any> {
		const hexIds = await LocationConverter.getHexId(update.longitude, update.latitude);
		existing.hexId = `${hexIds.cc}`;
        existing.updatedBy = modifier;
        await this.updateObj<SpaceGeom>(existing, update);
        return existing;
	}

	schemaDataMapper(data: any) {
        const { latitude, longitude, radius, geomId, length, width, metaData } = data;
        return ({
            latitude,
            longitude,
            inputGeometry: {
                attributes: {
                    geomId: geomId || 1,
                    area: {
                        ...(radius && { radius: parseInt(radius, 10) }),
                        ...(length && { length: parseInt(length, 10) }),
                        ...(width && { width: parseInt(width, 10) }),
                    }
                },
                geoJSON: {}
            },
            metaData: metaData || 'NONE',
            geometry: geomId || 1
        });
    }
}
// ----------------
