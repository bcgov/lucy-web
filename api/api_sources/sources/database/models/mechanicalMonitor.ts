// ** Model: MechanicalMonitor from schema MechanicalMonitorSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import {
	SpeciesAgencyCodeSchema,
	MechanicalTreatmentSchema,
	EfficacyCodeSchema,
	MechanicalMonitorSchema
} from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DateTimeTransformer } from '../../libs/transformer';
import {
	SpeciesAgencyCode,
	MechanicalTreatment,
	EfficacyCode
} from '.';
import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description MechanicalMonitor create interface
 */
export interface MechanicalMonitorSpec {
	observerFirstName: string;
	observerLastName: string;
	timestamp: string;
	paperFileID: string;
	comments: string;
	speciesAgency: SpeciesAgencyCode;
	mechanicalTreatmentID: MechanicalTreatment;
	efficacy: EfficacyCode;
}
// -- End: MechanicalMonitorSpec --


/** Interface **/
/**
 * @description MechanicalMonitor update interface
 */
export interface MechanicalMonitorUpdateSpec {
	observerFirstName?: string;
	observerLastName?: string;
	timestamp?: string;
	paperFileID?: string;
	comments?: string;
	speciesAgency?: SpeciesAgencyCode;
	mechanicalTreatmentID?: MechanicalTreatment;
	efficacy?: EfficacyCode;
}
// -- End: MechanicalMonitorUpdateSpec --

/**
 * @description Data Model Class for MechanicalMonitorSchema
 */
@ModelDescription({
	description: 'Data Model Class for MechanicalMonitorSchema',
	schema: MechanicalMonitorSchema,
	apiResource: false
})
@Entity( { name: MechanicalMonitorSchema.dbTable} )
export class MechanicalMonitor extends Record implements MechanicalMonitorSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {mechanical_monitor_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	mechanical_monitor_id: number;

	/**
	 * @description Getter/Setter property for column {observer_first_name}
	 */
	@Column({ name: MechanicalMonitorSchema.columns.observerFirstName})
	@ModelProperty({type: PropertyType.string})
	observerFirstName: string;

	/**
	 * @description Getter/Setter property for column {observer_last_name}
	 */
	@Column({ name: MechanicalMonitorSchema.columns.observerLastName})
	@ModelProperty({type: PropertyType.string})
	observerLastName: string;

	/**
	 * @description Getter/Setter property for column {mechanical_monitor_timestamp}
	 */
	@Column({ name: MechanicalMonitorSchema.columns.timestamp, transformer: new DateTimeTransformer()})
	@ModelProperty({type: PropertyType.string})
	timestamp: string;

	/**
	 * @description Getter/Setter property for column {mechanical_monitor_paper_file_ref}
	 */
	@Column({ name: MechanicalMonitorSchema.columns.paperFileID})
	@ModelProperty({type: PropertyType.string})
	paperFileID: string;

	/**
	 * @description Getter/Setter property for column {comments}
	 */
	@Column({ name: MechanicalMonitorSchema.columns.comments})
	@ModelProperty({type: PropertyType.string})
	comments: string;

	/**
	 * @description Getter/Setter property for column {species_agency_code_id}
	 */
	@ManyToOne( type => SpeciesAgencyCode, { eager: true})
	@JoinColumn({ name: MechanicalMonitorSchema.columns.speciesAgency, referencedColumnName: SpeciesAgencyCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	speciesAgency: SpeciesAgencyCode;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_id}
	 */
	@ManyToOne( type => MechanicalTreatment, { eager: true})
	@JoinColumn({ name: MechanicalMonitorSchema.columns.mechanicalTreatmentID, referencedColumnName: MechanicalTreatmentSchema.pk})
	@ModelProperty({type: PropertyType.object})
	mechanicalTreatmentID: MechanicalTreatment;

	/**
	 * @description Getter/Setter property for column {efficacy_code_id}
	 */
	@ManyToOne( type => EfficacyCode, { eager: true})
	@JoinColumn({ name: MechanicalMonitorSchema.columns.efficacy, referencedColumnName: EfficacyCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	efficacy: EfficacyCode;

}

// -------------------------------------
