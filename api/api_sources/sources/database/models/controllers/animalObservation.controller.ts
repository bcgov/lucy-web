// ** AnimalObservationController ** //

import { RecordController } from '../generic.data.models';
import { AnimalObservation} from '../../models';
import { AnimalObservationSchema } from '../../database-schema';


/**
 * @description Data Model Controller Class for AnimalObservationSchema and AnimalObservation
 */
export class AnimalObservationController extends RecordController<AnimalObservation> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): AnimalObservationController {
		return this.sharedInstance<AnimalObservation>(AnimalObservation, AnimalObservationSchema) as AnimalObservationController;
	}

	get exportKeyMapper(): {[key: string]: string} {
		return {
            'spaceGeom.id': 'location.id',
            'spaceGeom.latitude': 'location.latitude',
            'spaceGeom.longitude': 'location.longitude',
            'spaceGeom.hexId': 'location.hexId',
            'spaceGeom.subHexId': 'location.subHexId',
            'spaceGeom.metaData': 'location.metaData',
            'spaceGeom.geometry': 'location.geometry',
            'spaceGeom.inputGeometry': 'location.inputGeometry',
            'spaceGeom.inputGeometry.attributes.area.width': 'location.area.width',
            'spaceGeom.inputGeometry.attributes.area.length': 'location.area.length',
            'spaceGeom.inputGeometry.attributes.geomId': 'location.geomId'
        };
	}

	get exportKeyPriorities(): {[key: string]: number} {
        return {
			id: 5,
			timestamp: 4,
            observerFirstName: 3,
            observerLastName: 2
        };
	}

	async search(param: string): Promise<AnimalObservation[]> {
        const keyword = `%${param}%`;
        const items = await this.repo.createQueryBuilder('animal_observation')
            .innerJoinAndSelect('animal_observation.species', 'species')
            .innerJoinAndSelect('animal_observation.lifeStage', 'lifeStage')
            .innerJoinAndSelect('animal_observation.behaviour', 'behavior')
            .innerJoinAndSelect('animal_observation.speciesAgency', 'agency')
            .innerJoinAndSelect('animal_observation.spaceGeom', 'spaceGeom')
            .where('CAST(animal_observation.animal_observation_id as TEXT) LIKE :keyword', { keyword })
            .orWhere('animal_observation.observerFirstName ILIKE :keyword', { keyword })
            .orWhere('animal_observation.observerLastName ILIKE :keyword', { keyword })
            .orWhere('species.commonName ILIKE :keyword', { keyword })
            .orWhere('lifeStage.description ILIKE :keyword', { keyword })
            .orWhere('behavior.description ILIKE :keyword', { keyword })
            .orderBy('animal_observation.updatedAt', 'DESC')
            .getMany();
        return items;
    }
}
// ----------------
