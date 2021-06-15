// ** Model: WatercraftJourney from schema WatercraftJourneySchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { WatercraftJourneySchema } from '../database-schema';
import {
	WatercraftRiskAssessmentSchema,
	WaterBodySchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { IntTransformer } from '../../libs/transformer';
import {
	WatercraftRiskAssessment,
	WaterBody
} from '../models';

import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description WatercraftJourney create interface
 */
export interface WatercraftJourneySpec {
	journeyType: number;
	numberOfDaysOut: string;
	otherWaterBody: string;
	watercraftAssessment: WatercraftRiskAssessment;
	waterBody: WaterBody;
}
// -- End: WatercraftJourneySpec --


/** Interface **/
/**
 * @description WatercraftJourney update interface
 */
export interface WatercraftJourneyUpdateSpec {
	journeyType?: number;
	numberOfDaysOut?: string;
	otherWaterBody?: string;
	watercraftAssessment?: WatercraftRiskAssessment;
	waterBody?: WaterBody;
}
// -- End: WatercraftJourneyUpdateSpec --

/**
 * @description Data Model Class for WatercraftJourneySchema
 */
@ModelDescription({
	description: 'Data Model Class for WatercraftJourneySchema',
	schema: WatercraftJourneySchema,
	apiResource: false
})
@Entity( { name: WatercraftJourneySchema.dbTable} )
export class WatercraftJourney extends Record implements WatercraftJourneySpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {watercraft_journey_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	watercraft_journey_id: number;

	/**
	 * @description Getter/Setter property for column {journey_type}
	 */
	@Column({name: WatercraftJourneySchema.columns.journeyType, transformer: new IntTransformer()})
	@ModelProperty({type: PropertyType.number})
	journeyType: number;

	/**
	 * @description Getter/Setter property for column {number_of_days_out}
	 */
	@Column({name: WatercraftJourneySchema.columns.numberOfDaysOut, transformer: new IntTransformer()})
	@ModelProperty({type: PropertyType.number})
	numberOfDaysOut: string;

	/**
	 * @description Getter/Setter property for column {other_water_body_detail}
	 */
	@Column({ name: WatercraftJourneySchema.columns.otherWaterBody})
	@ModelProperty({type: PropertyType.string})
	otherWaterBody: string;

	/**
	 * @description Getter/Setter property for column {watercraft_risk_assessment_id}
	 */
	@ManyToOne( type => WatercraftRiskAssessment, { eager: false})
	@JoinColumn({ name: WatercraftJourneySchema.columns.watercraftAssessment, referencedColumnName: WatercraftRiskAssessmentSchema.pk})
	@ModelProperty({type: PropertyType.object})
	watercraftAssessment: WatercraftRiskAssessment;

	/**
	 * @description Getter/Setter property for column {water_body_id}
	 */
	@ManyToOne( type => WaterBody, { eager: true})
	@JoinColumn({ name: WatercraftJourneySchema.columns.waterBody, referencedColumnName: WaterBodySchema.pk})
	@ModelProperty({type: PropertyType.object})
	waterBody: WaterBody;

}

// -------------------------------------
