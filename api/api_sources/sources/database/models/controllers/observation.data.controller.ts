/**
 * Imports
 */
import {
    Observation,
    ObservationUpdateModel
} from '../observation';
import { MechanicalTreatment } from '../mechanical.treatment';
import { RecordController } from '../generic.data.models';
import { MechanicalTreatmentController } from './mechanicalTreatment.controller';
import { setNull } from '../../../libs/utilities';
import { User } from '../user';
import { DataModelController } from '../../data.model.controller';
import { JurisdictionCode} from '../observation.codes';
import { Species } from '../species';
import { ObservationSchema, SpeciesSchema, JurisdictionCodeSchema } from '../../database-schema';

/**
 * @description Request body of observation create
 */

/**
 * @description Data Model controller for Observation
 */
export class ObservationController extends RecordController<Observation> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): ObservationController {
        return this.sharedInstance<Observation>(Observation, ObservationSchema) as ObservationController;
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
			date: 4,
            observerFirstName: 3,
            observerLastName: 2
        };
    }

    public async findById(id: number): Promise<Observation> {
        const item: Observation = await super.findById(id) as Observation;
        if (item) {
            const mts = await item.mechanicalTreatmentsFetcher || [];
            const newItems: MechanicalTreatment[] = [];
            if (mts.length > 0) {
                const newMts = await mts.map(async (mt) => {
                    return MechanicalTreatmentController.shared.findById(mt.mechanical_treatment_id);
                });
                for (let i = 0; i < newMts.length; i++) {
                    const mtFull = await newMts[i];
                    delete(mtFull.observations);
                    newItems.push(mtFull);
                }
                item.mechanicalTreatments = newItems;
            }
        }
        return item;
    }

    /**
     * @description Update observation
     * @param Observation observation:  Input observation
     * @param ObservationUpdateModel update: Input values
     * @param  User user : Update by
     */
    async updateObject(obj: Observation, data: ObservationUpdateModel, modifier: User) {
        if (data.sampleTakenIndicator === false) {
            setNull<Observation>(obj, 'sampleIdentifier');
         }
         return super.updateObject(obj, data, modifier);
    }

    async search(param: string): Promise<Observation[]> {
        const keyword = `%${param}%`;
        const items = await this.repo.createQueryBuilder('observation')
            .innerJoinAndSelect('observation.species', 'species')
            .innerJoinAndSelect('observation.jurisdiction', 'jurisdiction')
            .innerJoinAndSelect('observation.speciesAgency', 'agency')
            .innerJoinAndSelect('observation.spaceGeom', 'spaceGeom')
            .innerJoinAndSelect('observation.density', 'density')
            .innerJoinAndSelect('observation.distribution', 'distribution')
            .innerJoinAndSelect('observation.observationType', 'observationType')
            .innerJoinAndSelect('observation.soilTexture', 'soilTexture')
            .innerJoinAndSelect('observation.specificUseCode', 'specificUseCode')
            .innerJoinAndSelect('observation.slopeCode', 'slopeCode')
            .innerJoinAndSelect('observation.aspectCode', 'aspectCode')
            .innerJoinAndSelect('observation.proposedAction', 'proposedAction')
            .where('CAST(observation.observation_id as TEXT) LIKE :keyword', { keyword })
            .orWhere('observation.observerFirstName ILIKE :keyword', { keyword })
            .orWhere('observation.observerLastName ILIKE :keyword', { keyword })
            .orWhere('species.commonName ILIKE :keyword', { keyword })
            .orWhere('jurisdiction.description ILIKE :keyword', { keyword })
            .orWhere('agency.description ILIKE :keyword', { keyword })
            .orderBy('observation.updatedAt', 'DESC')
            .getMany();
        return items;
    }
}

/**
 * @description Data Model controller for Species
 */
export class SpeciesController extends DataModelController<Species> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): SpeciesController {
        return this.sharedInstance<Species>(Species, SpeciesSchema) as SpeciesController;
    }

    /**
	 * @description Overriding all method to sort alphabetically by common name
	 * @param object query
	 * ** Sorting Code
	 * ** (a, b) => ((a.commonName > b.commonName) ? 1 : (b.commonName > a.commonName) ? -1 : 0 )
	 */
	async all(query?: object) {
		const d = await super.all(query);
		d.sort( (a, b) => ((a.commonName > b.commonName) ? 1 : (b.commonName > a.commonName) ? -1 : 0 ));
		return d;
	}
}

/**
 * @description Data Model controller for JurisdictionCode
 */
export class JurisdictionCodeController extends DataModelController<JurisdictionCode> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): JurisdictionCodeController {
        return this.sharedInstance<JurisdictionCode>(JurisdictionCode, JurisdictionCodeSchema) as JurisdictionCodeController;
    }
}

// -----------------------------------------------------------------------------------------------------------
