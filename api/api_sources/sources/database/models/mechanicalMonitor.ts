// ** Model: MechanicalMonitor from schema MechanicalMonitorSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { MechanicalMonitorSchema } from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer, DateTransformer } from '../../libs/transformer';
import { SpeciesAgencyCode,
	Species,
} from '../models';

import { BaseModel } from './baseModel';

/** Interface **/
/**
 * @description MechanicalMonitor create interface
 */
export interface MechanicalMonitorSpec {
	date: string;
	paperFileID: string;
	efficacy: number;
	comments: string;
	speciesAgency: SpeciesAgencyCode;
	species: Species;
	mechanicalTreatmentID: object;
}
// -- End: MechanicalMonitorSpec --


/** Interface **/
/**
 * @description MechanicalMonitor update interface
 */
export interface MechanicalMonitorUpdateSpec {
	date?: string;
	paperFileID?: string;
	efficacy?: number;
	comments?: string;
	speciesAgency?: SpeciesAgencyCode;
	species?: Species;
	mechanicalTreatmentID?: object;
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
export class MechanicalMonitor extends BaseModel implements MechanicalMonitorSpec {

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
	 * @description Getter/Setter property for column {mechanical_monitor_date}
	 */
	@Column({name: MechanicalMonitorSchema.columns.date, transformer: new DateTransformer()})
	@ModelProperty({type: PropertyType.string})
	date: string;

	/**
	 * @description Getter/Setter property for column {mechanical_monitor_paper_file_ref}
	 */
	@Column({ name: MechanicalMonitorSchema.columns.paperFileID})
	@ModelProperty({type: PropertyType.string})
	paperFileID: string;

	/**
	 * @description Getter/Setter property for column {efficacy_rating}
	 */
	@Column({name: MechanicalMonitorSchema.columns.efficacy, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	efficacy: number;

	/**
	 * @description Getter/Setter property for column {comments}
	 */
	@Column({ name: MechanicalMonitorSchema.columns.comments})
	@ModelProperty({type: PropertyType.string})
	comments: string;

	/**
	 * @description Getter/Setter property for column {species_agency_code_id}
	 */
	@ManyToOne( type => #MODEL, { eager: true})
	@JoinColumn({ name: MechanicalMonitorSchema.columns.speciesAgency, referencedColumnName: #SCHEMA-NAME.pk})
	@ModelProperty({type: PropertyType.object})
	speciesAgency: SpeciesAgencyCode;

	/**
	 * @description Getter/Setter property for column {species_id}
	 */
	@ManyToOne( type => #MODEL, { eager: true})
	@JoinColumn({ name: MechanicalMonitorSchema.columns.species, referencedColumnName: #SCHEMA-NAME.pk})
	@ModelProperty({type: PropertyType.object})
	species: Species;

	/**
	 * @description Getter/Setter property for column {mechanical_treatment_id}
	 */
	@ManyToOne( type => #MODEL, { eager: true})
	@JoinColumn({ name: MechanicalMonitorSchema.columns.mechanicalTreatmentID, referencedColumnName: #SCHEMA-NAME.pk})
	@ModelProperty({type: PropertyType.object})
	mechanicalTreatmentID: object;

}

// -------------------------------------
