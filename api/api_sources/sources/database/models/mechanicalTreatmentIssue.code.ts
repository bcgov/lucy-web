// ** Model: MechanicalTreatmentIssueCode from schema MechanicalTreatmentIssueCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MechanicalTreatmentIssueCodeSchema } from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record } from './generic.data.models';


/** Interface **/
/**
 * @description MechanicalTreatmentIssueCode create interface
 */
export interface MechanicalTreatmentIssueCodeSpec {
	code: string;
	description: string;
	activeIndicator: boolean;
}
// -- End: MechanicalTreatmentIssueCodeSpec --


/** Interface **/
/**
 * @description MechanicalTreatmentIssueCode update interface
 */
export interface MechanicalTreatmentIssueCodeUpdateSpec {
	code?: string;
	description?: string;
	activeIndicator?: boolean;
}
// -- End: MechanicalTreatmentIssueCodeUpdateSpec --

/**
 * @description Data Model Class for MechanicalTreatmentIssueCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for MechanicalTreatmentIssueCodeSchema',
	schema: MechanicalTreatmentIssueCodeSchema,
	apiResource: false
})
@Entity( { name: MechanicalTreatmentIssueCodeSchema.dbTable} )
export class MechanicalTreatmentIssueCode extends Record {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_issue_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	mechanical_treatment_issue_code_id: number;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_issue_code}
	 */
	@Column({ name: MechanicalTreatmentIssueCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: MechanicalTreatmentIssueCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: MechanicalTreatmentIssueCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}

// -------------------------------------
