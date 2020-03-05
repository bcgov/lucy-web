// ** Model: PreviousAISKnowledgeSource from schema PreviousAISKnowledgeSourceSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PreviousAISKnowledgeSourceSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record } from './generic.data.models';
import { DataModelController } from '../data.model.controller';

/** Interface **/
/**
 * @description PreviousAISKnowledgeSource create interface
 */
export interface PreviousAISKnowledgeSourceSpec {
	description: string;
}
// -- End: PreviousAISKnowledgeSourceSpec --


/** Interface **/
/**
 * @description PreviousAISKnowledgeSource update interface
 */
export interface PreviousAISKnowledgeSourceUpdateSpec {
	description?: string;
}
// -- End: PreviousAISKnowledgeSourceUpdateSpec --

/**
 * @description Data Model Class for PreviousAISKnowledgeSourceSchema
 */
@ModelDescription({
	description: 'Data Model Class for PreviousAISKnowledgeSourceSchema',
	schema: PreviousAISKnowledgeSourceSchema,
	apiResource: false
})
@Entity( { name: PreviousAISKnowledgeSourceSchema.dbTable} )
export class PreviousAISKnowledgeSource extends Record implements PreviousAISKnowledgeSourceSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {previous_ais_knowledge_source_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	previous_ais_knowledge_source_code_id: number;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: PreviousAISKnowledgeSourceSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

}


// ** PreviousAISKnowledgeSourceController ** //


/**
 * @description Data Model Controller Class for PreviousAISKnowledgeSourceSchema and PreviousAISKnowledgeSource
 */
export class PreviousAISKnowledgeSourceController extends DataModelController<PreviousAISKnowledgeSource> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): PreviousAISKnowledgeSourceController {
		return this.sharedInstance<PreviousAISKnowledgeSource>(PreviousAISKnowledgeSource, PreviousAISKnowledgeSourceSchema) as PreviousAISKnowledgeSourceController;
	}
}

// -------------------------------------
