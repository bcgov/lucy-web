// ** Model: EfficacyCode from schema EfficacyCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { EfficacyCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description EfficacyCode create interface
 */
export interface EfficacyCodeSpec {
	efficacyRating: string;
	activeIndicator: boolean;
}
// -- End: EfficacyCodeSpec --


/** Interface **/
/**
 * @description EfficacyCode update interface
 */
export interface EfficacyCodeUpdateSpec {
	efficacyRating?: string;
	activeIndicator?: boolean;
}
// -- End: EfficacyCodeUpdateSpec --

/**
 * @description Data Model Class for EfficacyCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for EfficacyCodeSchema',
	schema: EfficacyCodeSchema,
	apiResource: false
})
@Entity( { name: EfficacyCodeSchema.dbTable} )
export class EfficacyCode extends Record implements EfficacyCodeSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {efficacy_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	efficacy_code_id: number;

	/**
	 * @description Getter/Setter property for column {efficacy_rating}
	 */
	@Column({ name: EfficacyCodeSchema.columns.efficacyRating})
	@ModelProperty({type: PropertyType.string})
	efficacyRating: string;


	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: EfficacyCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}

// -------------------------------------
