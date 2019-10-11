// ** Model: ChemicalTreatmentEmployee from schema ChemicalTreatmentEmployeeSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ChemicalTreatmentEmployeeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';

import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description ChemicalTreatmentEmployee create interface
 */
export interface ChemicalTreatmentEmployeeSpec {
	certificate: string;
	firstName: string;
	lastName: string;
}
// -- End: ChemicalTreatmentEmployeeSpec --


/** Interface **/
/**
 * @description ChemicalTreatmentEmployee update interface
 */
export interface ChemicalTreatmentEmployeeUpdateSpec {
	certificate?: string;
	firstName?: string;
	lastName?: string;
}
// -- End: ChemicalTreatmentEmployeeUpdateSpec --

/**
 * @description Data Model Class for ChemicalTreatmentEmployeeSchema
 */
@ModelDescription({
	description: 'Data Model Class for ChemicalTreatmentEmployeeSchema',
	schema: ChemicalTreatmentEmployeeSchema,
	apiResource: false
})
@Entity( { name: ChemicalTreatmentEmployeeSchema.dbTable} )
export class ChemicalTreatmentEmployee extends Record implements ChemicalTreatmentEmployeeSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {chemical_treatment_employee_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	chemical_treatment_employee_id: number;

	/**
	 * @description Getter/Setter property for column {certificate}
	 */
	@Column({ name: ChemicalTreatmentEmployeeSchema.columns.certificate})
	@ModelProperty({type: PropertyType.string})
	certificate: string;

	/**
	 * @description Getter/Setter property for column {first_name}
	 */
	@Column({ name: ChemicalTreatmentEmployeeSchema.columns.firstName})
	@ModelProperty({type: PropertyType.string})
	firstName: string;

	/**
	 * @description Getter/Setter property for column {last_Name}
	 */
	@Column({ name: ChemicalTreatmentEmployeeSchema.columns.lastName})
	@ModelProperty({type: PropertyType.string})
	lastName: string;

}

// -------------------------------------
