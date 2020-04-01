// ** Model: PreviousInspectionSource from schema PreviousInspectionSourceSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PreviousInspectionSourceSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record } from './generic.data.models';
import { DataModelController } from '../data.model.controller';

/** Interface **/
/**
 * @description PreviousInspectionSource create interface
 */
export interface PreviousInspectionSourceSpec {
	description: string;
}
// -- End: PreviousInspectionSourceSpec --


/** Interface **/
/**
 * @description PreviousInspectionSource update interface
 */
export interface PreviousInspectionSourceUpdateSpec {
	description?: string;
}
// -- End: PreviousInspectionSourceUpdateSpec --

/**
 * @description Data Model Class for PreviousInspectionSourceSchema
 */
@ModelDescription({
	description: 'Data Model Class for PreviousInspectionSourceSchema',
	schema: PreviousInspectionSourceSchema,
	apiResource: false
})
@Entity( { name: PreviousInspectionSourceSchema.dbTable} )
export class PreviousInspectionSource extends Record implements PreviousInspectionSourceSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {previous_inspection_source_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	previous_inspection_source_code_id: number;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: PreviousInspectionSourceSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

}


// ** PreviousInspectionSourceController ** //


/**
 * @description Data Model Controller Class for PreviousInspectionSourceSchema and PreviousInspectionSource
 */
export class PreviousInspectionSourceController extends DataModelController<PreviousInspectionSource> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): PreviousInspectionSourceController {
		return this.sharedInstance<PreviousInspectionSource>(PreviousInspectionSource, PreviousInspectionSourceSchema) as PreviousInspectionSourceController;
	}
}

// -------------------------------------
