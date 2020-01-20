// ** Model: ObserverWorkflow from schema ObserverWorkflowSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { ObserverWorkflowSchema } from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer, DateTransformer, DateTimeTransformer } from '../../libs/transformer';
import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description ObserverWorkflow create interface
 */
export interface ObserverWorkflowSpec {
	date: string;
	startTime: string;
	endTime: string;
	station: string;
	location: string;
	shiftStartComment: string;
	shiftEndComment: string;
	motorizedBlowBys: number;
	nonMotorizedBlowBys: number;
	boatsInspected: boolean;
	sunny: boolean;
	cloudy: boolean;
	raining: boolean;
	snowing: boolean;
	foggy: boolean;
	windy: boolean;
	k9OnShift: boolean;
}
// -- End: ObserverWorkflowSpec --


/** Interface **/
/**
 * @description ObserverWorkflow update interface
 */
export interface ObserverWorkflowUpdateSpec {
	date?: string;
	startTime?: string;
	endTime?: string;
	station?: string;
	location?: string;
	shiftStartComment?: string;
	shiftEndComment?: string;
	motorizedBlowBys?: number;
	nonMotorizedBlowBys?: number;
	boatsInspected?: boolean;
	sunny?: boolean;
	cloudy?: boolean;
	raining?: boolean;
	snowing?: boolean;
	foggy?: boolean;
	windy?: boolean;
	k9OnShift?: boolean;
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
	 * @description Getter/Setter property for column {start_time}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.startTime, transformer: new DateTimeTransformer()})
	@ModelProperty({type: PropertyType.string})
	startTime: string;

	/**
	 * @description Getter/Setter property for column {end_time}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.endTime, transformer: new DateTimeTransformer()})
	@ModelProperty({type: PropertyType.string})
	endTime: string;

	/**
	 * @description Getter/Setter property for column {station}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.station})
	@ModelProperty({type: PropertyType.string})
	station: string;

	/**
	 * @description Getter/Setter property for column {location}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.location})
	@ModelProperty({type: PropertyType.string})
	location: string;

	/**
	 * @description Getter/Setter property for column {shift_start_comment}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.shiftStartComment})
	@ModelProperty({type: PropertyType.string})
	shiftStartComment: string;

	/**
	 * @description Getter/Setter property for column {shift_end_comment}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.shiftEndComment})
	@ModelProperty({type: PropertyType.string})
	shiftEndComment: string;

	/**
	 * @description Getter/Setter property for column {motorized_blow_bys_counter}
	 */
	@Column({name: ObserverWorkflowSchema.columns.motorizedBlowBys, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	motorizedBlowBys: number;

	/**
	 * @description Getter/Setter property for column {non_motorized_blow_bys_counter}
	 */
	@Column({name: ObserverWorkflowSchema.columns.nonMotorizedBlowBys, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	nonMotorizedBlowBys: number;

	/**
	 * @description Getter/Setter property for column {boats_inspected_ind}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.boatsInspected})
	@ModelProperty({type: PropertyType.boolean})
	boatsInspected: boolean;

	/**
	 * @description Getter/Setter property for column {weather_sunny_ind}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.sunny})
	@ModelProperty({type: PropertyType.boolean})
	sunny: boolean;

	/**
	 * @description Getter/Setter property for column {weather_cloudy_ind}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.cloudy})
	@ModelProperty({type: PropertyType.boolean})
	cloudy: boolean;

	/**
	 * @description Getter/Setter property for column {weather_raining_ind}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.raining})
	@ModelProperty({type: PropertyType.boolean})
	raining: boolean;

	/**
	 * @description Getter/Setter property for column {weather_snowing_ind}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.snowing})
	@ModelProperty({type: PropertyType.boolean})
	snowing: boolean;

	/**
	 * @description Getter/Setter property for column {weather_foggy_ind}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.foggy})
	@ModelProperty({type: PropertyType.boolean})
	foggy: boolean;

	/**
	 * @description Getter/Setter property for column {weather_windy_ind}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.windy})
	@ModelProperty({type: PropertyType.boolean})
	windy: boolean;

	/**
	 * @description Getter/Setter property for column {k9_on_shift_ind}
	 */
	@Column({ name: ObserverWorkflowSchema.columns.k9OnShift})
	@ModelProperty({type: PropertyType.boolean})
	k9OnShift: boolean;

}

// -------------------------------------
