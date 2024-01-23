// ** Model: BlowBy from schema BlowBySchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { BlowBySchema, ObserverWorkflowSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { ObserverWorkflow, Record } from '../models';
import { DateTimeTransformer } from '../../libs/transformer';

/** Interface **/
/**
 * @description BlowBy create interface
 */
export interface BlowBySpec {
	observerWorkflowId: ObserverWorkflow;
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
	observerWorkflowId?: ObserverWorkflow;
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
export class BlowBy extends Record implements BlowBySpec {

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
	 * @description Getter/Setter property for column {observer_workflow_id}
	 */
	@ManyToOne( type => ObserverWorkflow, { eager: true})
	@JoinColumn({ name: BlowBySchema.columns.observerWorkflowId, referencedColumnName: ObserverWorkflowSchema.pk})
	@ModelProperty({type: PropertyType.object})
	observerWorkflowId: ObserverWorkflow;

	/**
	 * @description Getter/Setter property for column {blow_by_time}
	 */
	@Column({ name: BlowBySchema.columns.blowByTime, transformer: new DateTimeTransformer()})
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

// -------------------------------------
