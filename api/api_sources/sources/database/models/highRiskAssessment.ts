// ** Model: HighRiskAssessment from schema HighRiskAssessmentSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { HighRiskAssessmentSchema, AdultMusselsLocationSchema } from '../database-schema';
import { AdultMusselsLocation } from '../models';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { IntTransformer } from '../../libs/transformer';

import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description HighRiskAssessment create interface
 */
export interface HighRiskAssessmentSpec {
	cleanDrainDryAfterInspection: boolean;
	quarantinePeriodIssued: boolean;
	standingWaterPresent: boolean;
	adultDreissenidaeMusselFound: boolean;
	decontaminationPerformed: boolean;
	decontaminationOrderIssued: boolean;
	sealIssued: boolean;
	dreissenidMusselsFoundPrevious: boolean;
	watercraftRegistration: string;
	decontaminationReference: string;
	decontaminationOrderNumber: number;
	decontaminationOrderReason: string;
	sealNumber: number;
	standingWaterLocation: object;
	adultDreissenidaeMusselDetail: object;
	otherInspectionFindings: string;
	generalComments: string;
}
// -- End: HighRiskAssessmentSpec --


/** Interface **/
/**
 * @description HighRiskAssessment update interface
 */
export interface HighRiskAssessmentUpdateSpec {
	cleanDrainDryAfterInspection?: boolean;
	quarantinePeriodIssued?: boolean;
	standingWaterPresent?: boolean;
	adultDreissenidaeMusselFound?: boolean;
	decontaminationPerformed?: boolean;
	decontaminationOrderIssued?: boolean;
	sealIssued?: boolean;
	dreissenidMusselsFoundPrevious?: boolean;
	watercraftRegistration?: string;
	decontaminationReference?: string;
	decontaminationOrderNumber?: number;
	decontaminationOrderReason?: string;
	sealNumber?: number;
	standingWaterLocation?: object;
	adultDreissenidaeMusselDetail?: object;
	otherInspectionFindings?: string;
	generalComments?: string;
}
// -- End: HighRiskAssessmentUpdateSpec --

/**
 * @description Data Model Class for HighRiskAssessmentSchema
 */
@ModelDescription({
	description: 'Data Model Class for HighRiskAssessmentSchema',
	schema: HighRiskAssessmentSchema,
	apiResource: false
})
@Entity( { name: HighRiskAssessmentSchema.dbTable} )
export class HighRiskAssessment extends Record implements HighRiskAssessmentSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {high_risk_assessment_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	high_risk_assessment_id: number;

	/**
	 * @description Getter/Setter property for column {clean_drain_dry_after_inspection_ind}
	 */
	@Column({ name: HighRiskAssessmentSchema.columns.cleanDrainDryAfterInspection})
	@ModelProperty({type: PropertyType.boolean})
	cleanDrainDryAfterInspection: boolean;

	/**
	 * @description Getter/Setter property for column {quarantine_period_issued_ind}
	 */
	@Column({ name: HighRiskAssessmentSchema.columns.quarantinePeriodIssued})
	@ModelProperty({type: PropertyType.boolean})
	quarantinePeriodIssued: boolean;

	/**
	 * @description Getter/Setter property for column {standing_water_present_ind}
	 */
	@Column({ name: HighRiskAssessmentSchema.columns.standingWaterPresent})
	@ModelProperty({type: PropertyType.boolean})
	standingWaterPresent: boolean;

	/**
	 * @description Getter/Setter property for column {adult_dreissenidae_mussel_found_ind}
	 */
	@Column({ name: HighRiskAssessmentSchema.columns.adultDreissenidaeMusselFound})
	@ModelProperty({type: PropertyType.boolean})
	adultDreissenidaeMusselFound: boolean;

	/**
	 * @description Getter/Setter property for column {decontamination_performed_ind}
	 */
	@Column({ name: HighRiskAssessmentSchema.columns.decontaminationPerformed})
	@ModelProperty({type: PropertyType.boolean})
	decontaminationPerformed: boolean;

	/**
	 * @description Getter/Setter property for column {decontamination_order_issued_ind}
	 */
	@Column({ name: HighRiskAssessmentSchema.columns.decontaminationOrderIssued})
	@ModelProperty({type: PropertyType.boolean})
	decontaminationOrderIssued: boolean;

	/**
	 * @description Getter/Setter property for column {seal_issued_ind}
	 */
	@Column({ name: HighRiskAssessmentSchema.columns.sealIssued})
	@ModelProperty({type: PropertyType.boolean})
	sealIssued: boolean;

	/**
	 * @description Getter/Setter property for column {dreissenid_mussels_found_previous}
	 */
	 @Column({ name: HighRiskAssessmentSchema.columns.dreissenidMusselsFoundPrevious})
	 @ModelProperty({type: PropertyType.boolean})
	 dreissenidMusselsFoundPrevious: boolean;

	/**
	 * @description Getter/Setter property for column {watercraft_registration}
	 */
	@Column({ name: HighRiskAssessmentSchema.columns.watercraftRegistration})
	@ModelProperty({type: PropertyType.string})
	watercraftRegistration: string;

	/**
	 * @description Getter/Setter property for column {decontamination_reference}
	 */
	@Column({ name: HighRiskAssessmentSchema.columns.decontaminationReference})
	@ModelProperty({type: PropertyType.string})
	decontaminationReference: string;

	/**
	 * @description Getter/Setter property for column {decontamination_order_number}
	 */
	@Column({name: HighRiskAssessmentSchema.columns.decontaminationOrderNumber, transformer: new IntTransformer()})
	@ModelProperty({type: PropertyType.number})
	decontaminationOrderNumber: number;

	/**
	 * @description Getter/Setter property for column {decontamination_order_reason}
	 */
	 @Column({name: HighRiskAssessmentSchema.columns.decontaminationOrderReason, transformer: new IntTransformer()})
	 @ModelProperty({type: PropertyType.string})
	 decontaminationOrderReason: string;

	/**
	 * @description Getter/Setter property for column {seal_number}
	 */
	@Column({name: HighRiskAssessmentSchema.columns.sealNumber, transformer: new IntTransformer()})
	@ModelProperty({type: PropertyType.number})
	sealNumber: number;

	/**
	 * @description Getter/Setter property for column {other_inspection_findings}
	 */
	@Column({ name: HighRiskAssessmentSchema.columns.otherInspectionFindings})
	@ModelProperty({type: PropertyType.string})
	otherInspectionFindings: string;

	/**
	 * @description Getter/Setter property for column {general_comments}
	 */
	@Column({ name: HighRiskAssessmentSchema.columns.generalComments})
	@ModelProperty({type: PropertyType.string})
	generalComments: string;

	/**
	 * @description Getter/Setter property for column {standing_water_location_code_id}
	 */
	@ManyToOne( type => AdultMusselsLocation, { eager: true})
	@JoinColumn({ name: HighRiskAssessmentSchema.columns.standingWaterLocation, referencedColumnName: AdultMusselsLocationSchema.pk})
	@ModelProperty({type: PropertyType.object})
	standingWaterLocation: AdultMusselsLocation;

	/**
	 * @description Getter/Setter property for column {adult_mussels_location_code_id}
	 */
	@ManyToOne( type => AdultMusselsLocation, { eager: true})
	@JoinColumn({ name: HighRiskAssessmentSchema.columns.adultDreissenidaeMusselDetail, referencedColumnName: AdultMusselsLocationSchema.pk})
	@ModelProperty({type: PropertyType.object})
	adultDreissenidaeMusselDetail: AdultMusselsLocation;

}

// -------------------------------------
