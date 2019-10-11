// ** Model: PesticideEmployerCode from schema PesticideEmployerCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PesticideEmployerCodeSchema } from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer, DateTransformer } from '../../libs/transformer';
import { DataModelController } from '../data.model.controller';
import { Record } from './generic.data.models';

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



// ** PesticideEmployerCodeController **//
/**
 * @description Data Model Controller Class for PesticideEmployerCodeSchema and PesticideEmployerCode
 */
export class PesticideEmployerCodeController extends DataModelController<PesticideEmployerCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): PesticideEmployerCodeController {
		return this.sharedInstance<PesticideEmployerCode>(PesticideEmployerCode, PesticideEmployerCodeSchema) as PesticideEmployerCodeController;
	}
}

// -------------------------------------
