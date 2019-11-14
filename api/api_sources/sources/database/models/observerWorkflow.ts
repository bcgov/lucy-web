// ** Model: ObserverWorkflow from schema ObserverWorkflowSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObserverWorkflowSchema } from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DateTransformer } from '../../libs/transformer';
import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description ObserverWorkflow create interface
 */
export interface ObserverWorkflowSpec {
	date: string;
	startOfDayForm: object;
	endOfDayForm: object;
	info: object;
}
// -- End: ObserverWorkflowSpec --


/** Interface **/
/**
 * @description ObserverWorkflow update interface
 */
export interface ObserverWorkflowUpdateSpec {
	date?: string;
	startOfDayForm?: object;
	endOfDayForm?: object;
	info?: object;
}
// -- End: ObserverWorkflowUpdateSpec --

/**
 * @description Data Model Class for ObserverWorkflowSchema
 */
@ModelDescription({
	description: 'Data Model Class for ObserverWorkflowSchema',
	schema: ObserverWorkflowSchema,
	apiResource: false
})
@Entity( { name: ObserverWorkflowSchema.dbTable} )
export class ObserverWorkflow extends Record implements ObserverWorkflowSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {observer_workflow_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	observer_workflow_id: number;

	/**
	 * @description Getter/Setter property for column {date}
	 */
	@Column({name: ObserverWorkflowSchema.columns.date, transformer: new DateTransformer()})
	@ModelProperty({type: PropertyType.string})
	date: string;

	/**
	 * @description Getter/Setter property for column {start_of_day_form}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.startOfDayForm, type: 'jsonb'})
	@ModelProperty({type: PropertyType.object})
	startOfDayForm: object;

	/**
	 * @description Getter/Setter property for column {end_of_day_form}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.endOfDayForm, type: 'jsonb'})
	@ModelProperty({type: PropertyType.object})
	endOfDayForm: object;

	/**
	 * @description Getter/Setter property for column {info}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.info, type: 'jsonb'})
	@ModelProperty({type: PropertyType.object})
	info: object;

}

// -------------------------------------
