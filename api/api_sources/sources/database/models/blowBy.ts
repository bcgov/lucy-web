// ** Model: BlowBy from schema BlowBySchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BlowBySchema } from '../database-schema';
import {
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import {
} from '../models';

import { BaseModel } from './baseModel';
import { DataModelController } from '../data.model.controller';

/** Interface **/
/**
 * @description BlowBy create interface
 */
export interface BlowBySpec {
	blowByTime: string;
	watercraftComplexity: string;
	reportedToRapp: boolean;
}
// -- End: BlowBySpec --


/** Interface **/
/**
 * @description BlowBy update interface
 */
export interface BlowByUpdateSpec {
	blowByTime?: string;
	watercraftComplexity?: string;
	reportedToRapp?: boolean;
}
// -- End: BlowByUpdateSpec --

/**
 * @description Data Model Class for BlowBySchema
 */
@ModelDescription({
	description: 'Data Model Class for BlowBySchema',
	schema: BlowBySchema,
	apiResource: false
})
@Entity( { name: BlowBySchema.dbTable} )
export class BlowBy extends BaseModel implements BlowBySpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {blow_by_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	blow_by_id: number;

	/**
	 * @description Getter/Setter property for column {blow_by_time}
	 */
	@Column({ name: BlowBySchema.columns.blowByTime})
	@ModelProperty({type: PropertyType.string})
	blowByTime: string;

	/**
	 * @description Getter/Setter property for column {watercraft_complexity}
	 */
	@Column({ name: BlowBySchema.columns.watercraftComplexity})
	@ModelProperty({type: PropertyType.string})
	watercraftComplexity: string;

	/**
	 * @description Getter/Setter property for column {reported_to_rapp}
	 */
	@Column({ name: BlowBySchema.columns.reportedToRapp})
	@ModelProperty({type: PropertyType.boolean})
	reportedToRapp: boolean;

}


// ** BlowByController ** //


/**
 * @description Data Model Controller Class for BlowBySchema and BlowBy
 */
export class BlowByController extends DataModelController<BlowBy> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): BlowByController {
		return this.sharedInstance<BlowBy>(BlowBy, BlowBySchema) as BlowByController;
	}
}

// -------------------------------------
