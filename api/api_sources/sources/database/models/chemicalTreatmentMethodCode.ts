// ** Model: ChemicalTreatmentMethodCode from schema ChemicalTreatmentMethodCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { ChemicalTreatmentMethodCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description ChemicalTreatmentMethodCode create interface
 */
export interface ChemicalTreatmentMethodCodeSpec {
	treatmentMethodCode: string;
	treatmentMethodDescription: string;
}
// -- End: ChemicalTreatmentMethodCodeSpec --


/** Interface **/
/**
 * @description ChemicalTreatmentMethodCode update interface
 */
export interface ChemicalTreatmentMethodCodeUpdateSpec {
	treatmentMethodCode?: string;
	treatmentMethodDescription?: string;
}
// -- End: ChemicalTreatmentMethodCodeUpdateSpec --

/**
 * @description Data Model Class for ChemicalTreatmentMethodCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for ChemicalTreatmentMethodCodeSchema',
	schema: ChemicalTreatmentMethodCodeSchema,
	apiResource: false
})
@Entity( { name: ChemicalTreatmentMethodCodeSchema.dbTable} )
export class ChemicalTreatmentMethodCode extends Record implements ChemicalTreatmentMethodCodeSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {chemical_treatment_method_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	chemical_treatment_method_id: number;

	/**
	 * @description Getter/Setter property for column {treatment_method_code}
	 */
	@Column({ name: ChemicalTreatmentMethodCodeSchema.columns.treatmentMethodCode})
	@ModelProperty({type: PropertyType.string})
	treatmentMethodCode: string;

	/**
	 * @description Getter/Setter property for column {treatment_method_description}
	 */
	@Column({ name: ChemicalTreatmentMethodCodeSchema.columns.treatmentMethodDescription})
	@ModelProperty({type: PropertyType.string})
	treatmentMethodDescription: string;

}

// -------------------------------------
