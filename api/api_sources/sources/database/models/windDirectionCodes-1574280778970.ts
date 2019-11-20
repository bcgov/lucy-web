// ** Model: WindDirectionCodes from schema WindDirectionCodesSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { WindDirectionCodesSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { BaseModel } from './baseModel';

/** Interface **/
/**
 * @description WindDirectionCodes create interface
 */
export interface WindDirectionCodesSpec {
	code: string;
	description: string;
	activeIndicator: boolean;
}
// -- End: WindDirectionCodesSpec --


/** Interface **/
/**
 * @description WindDirectionCodes update interface
 */
export interface WindDirectionCodesUpdateSpec {
	code?: string;
	description?: string;
	activeIndicator?: boolean;
}
// -- End: WindDirectionCodesUpdateSpec --

/**
 * @description Data Model Class for WindDirectionCodesSchema
 */
@ModelDescription({
	description: 'Data Model Class for WindDirectionCodesSchema',
	schema: WindDirectionCodesSchema,
	apiResource: false
})
@Entity( { name: WindDirectionCodesSchema.dbTable} )
export class WindDirectionCodes extends BaseModel implements WindDirectionCodesSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {wind_direction_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	wind_direction_code_id: number;

	/**
	 * @description Getter/Setter property for column {wind_direction_code}
	 */
	@Column({ name: WindDirectionCodesSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: WindDirectionCodesSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: WindDirectionCodesSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}

// -------------------------------------
