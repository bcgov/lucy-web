// ** Model: MechanicalTreatmentObservation from schema MechanicalTreatmentObservationSchema **

import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { MechanicalTreatmentObservationSchema } from '../database-schema';
import {
	ObservationSchema,
	MechanicalTreatmentSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import {
	Observation,
	MechanicalTreatment
} from '../models';

import { BaseModel } from './baseModel';
import { DataModelController } from '../data.model.controller';

/** Interface **/
/**
 * @description MechanicalTreatmentObservation create interface
 */
export interface MechanicalTreatmentObservationSpec {
	observation: Observation;
	mechanicalTreatment: MechanicalTreatment;
}
// -- End: MechanicalTreatmentObservationSpec --


/** Interface **/
/**
 * @description MechanicalTreatmentObservation update interface
 */
export interface MechanicalTreatmentObservationUpdateSpec {
	observation?: Observation;
	mechanicalTreatment?: MechanicalTreatment;
}
// -- End: MechanicalTreatmentObservationUpdateSpec --

/**
 * @description Data Model Class for MechanicalTreatmentObservationSchema
 */
@ModelDescription({
	description: 'Data Model Class for MechanicalTreatmentObservationSchema',
	schema: MechanicalTreatmentObservationSchema,
	apiResource: false
})
@Entity( { name: MechanicalTreatmentObservationSchema.dbTable} )
export class MechanicalTreatmentObservation extends BaseModel implements MechanicalTreatmentObservationSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_observation_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	mechanical_treatment_observation_id: number;

	/**
	 * @description Getter/Setter property for column {observation_id}
	 */
	@ManyToOne( type => Observation, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentObservationSchema.columns.observation, referencedColumnName: ObservationSchema.pk})
	@ModelProperty({type: PropertyType.object})
	observation: Observation;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_id}
	 */
	@ManyToOne( type => MechanicalTreatment, { eager: true})
	@JoinColumn({ name: MechanicalTreatmentObservationSchema.columns.mechanicalTreatment, referencedColumnName: MechanicalTreatmentSchema.pk})
	@ModelProperty({type: PropertyType.object})
	mechanicalTreatment: MechanicalTreatment;

}


// ** MechanicalTreatmentObservationController ** //


/**
 * @description Data Model Controller Class for MechanicalTreatmentObservationSchema and MechanicalTreatmentObservation
 */
export class MechanicalTreatmentObservationController extends DataModelController<MechanicalTreatmentObservation> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): MechanicalTreatmentObservationController {
		return this.sharedInstance<MechanicalTreatmentObservation>(MechanicalTreatmentObservation, MechanicalTreatmentObservationSchema) as MechanicalTreatmentObservationController;
	}
}

// -------------------------------------
