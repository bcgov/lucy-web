// ** Model: PesticideEmployerCode from schema PesticideEmployerCodeSchema **

import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record } from './generic.data.models';
import { PesticideEmployerCodeSchema } from '../database-schema';
import { NumericTransformer, DateTransformer } from '../../libs/transformer';


/** Interface **/
/**
 * @description PesticideEmployerCode create interface
 */
export interface PesticideEmployerCodeSpec {
	registrationNumber: number;
	businessName: string;
	licenceExpiryDate: string;
}
// -- End: PesticideEmployerCodeSpec --


/** Interface **/
/**
 * @description PesticideEmployerCode update interface
 */
export interface PesticideEmployerCodeUpdateSpec {
	registrationNumber?: number;
	businessName?: string;
	licenceExpiryDate?: string;
}
// -- End: PesticideEmployerCodeUpdateSpec --

/**
 * @description Data Model Class for PesticideEmployerCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for PesticideEmployerCodeSchema',
	schema: PesticideEmployerCodeSchema,
	apiResource: false
})
@Entity( { name: PesticideEmployerCodeSchema.dbTable} )
export class PesticideEmployerCode extends Record implements PesticideEmployerCodeSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {pesticide_employer_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	pesticide_employer_code_id: number;

	/**
	 * @description Getter/Setter property for column {registration_number}
	 */
	@Column({name: PesticideEmployerCodeSchema.columns.registrationNumber, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	registrationNumber: number;

	/**
	 * @description Getter/Setter property for column {business_name}
	 */
	@Column({ name: PesticideEmployerCodeSchema.columns.businessName})
	@ModelProperty({type: PropertyType.string})
	businessName: string;

	/**
	 * @description Getter/Setter property for column {licence_expiry_date}
	 */
	@Column({name: PesticideEmployerCodeSchema.columns.licenceExpiryDate, transformer: new DateTransformer()})
	@ModelProperty({type: PropertyType.string})
	licenceExpiryDate: string;

}

// -------------------------------------
