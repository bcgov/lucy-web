// ** Model: LifeStageCode from schema LifeStageCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LifeStageCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { BaseModel } from './baseModel';
import { DataModelController } from '../data.model.controller';

/** Interface **/
/**
 * @description LifeStageCode create interface
 */
export interface LifeStageCodeSpec {
	code: string;
	description: string;
	activeIndicator: boolean;
}
// -- End: LifeStageCodeSpec --


/** Interface **/
/**
 * @description LifeStageCode update interface
 */
export interface LifeStageCodeUpdateSpec {
	code?: string;
	description?: string;
	activeIndicator?: boolean;
}
// -- End: LifeStageCodeUpdateSpec --

/**
 * @description Data Model Class for LifeStageCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for LifeStageCodeSchema',
	schema: LifeStageCodeSchema,
	apiResource: false
})
@Entity( { name: LifeStageCodeSchema.dbTable} )
export class LifeStageCode extends BaseModel implements LifeStageCodeSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {life_stage_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	life_stage_code_id: number;

	/**
	 * @description Getter/Setter property for column {life_stage_code}
	 */
	@Column({ name: LifeStageCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: LifeStageCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: LifeStageCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}

// ** LifeStageCodeController ** //


/**
 * @description Data Model Controller Class for LifeStageCodeSchema and LifeStageCode
 */
export class LifeStageCodeController extends DataModelController<LifeStageCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): LifeStageCodeController {
		return this.sharedInstance<LifeStageCode>(LifeStageCode, LifeStageCodeSchema) as LifeStageCodeController;
	}
}

// -------------------------------------
