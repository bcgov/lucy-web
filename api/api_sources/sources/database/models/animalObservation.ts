// ** Model: AnimalObservation from schema AnimalObservationSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { AnimalObservationSchema } from '../database-schema';
import {
	AnimalSpeciesSchema,
	SpeciesAgencyCodeSchema,
	LifeStageCodeSchema,
	BehaviourCodeSchema,
	SpaceGeomSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { IntTransformer } from '../../libs/transformer';
import {
	AnimalSpecies,
	SpeciesAgencyCode,
	LifeStageCode,
	BehaviourCode,
	SpaceGeom
} from '../models';

import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description AnimalObservation create interface
 */
export interface AnimalObservationSpec {
	timestamp: string;
	observerFirstName: string;
	observerLastName: string;
	numberOfIndividuals: number;
	comments: string;
	specimenAvailableIndicator: boolean;
	species: AnimalSpecies;
	speciesAgency: SpeciesAgencyCode;
	lifeStage: LifeStageCode;
	behaviour: BehaviourCode;
	spaceGeom: SpaceGeom;
}
// -- End: AnimalObservationSpec --


/** Interface **/
/**
 * @description AnimalObservation update interface
 */
export interface AnimalObservationUpdateSpec {
	timestamp?: string;
	observerFirstName?: string;
	observerLastName?: string;
	numberOfIndividuals?: number;
	comments?: string;
	specimenAvailableIndicator?: boolean;
	species?: AnimalSpecies;
	speciesAgency?: SpeciesAgencyCode;
	lifeStage?: LifeStageCode;
	behaviour?: BehaviourCode;
	spaceGeom?: SpaceGeom;
}
// -- End: AnimalObservationUpdateSpec --

/**
 * @description Data Model Class for AnimalObservationSchema
 */
@ModelDescription({
	description: 'Data Model Class for AnimalObservationSchema',
	schema: AnimalObservationSchema,
	apiResource: false
})
@Entity( { name: AnimalObservationSchema.dbTable} )
export class AnimalObservation extends Record implements AnimalObservationSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {animal_observation_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	animal_observation_id: number;

	/**
	 * @description Getter/Setter property for column {observation_timestamp}
	 */
	@Column({ name: AnimalObservationSchema.columns.timestamp})
	@ModelProperty({type: PropertyType.string})
	timestamp: string;

	/**
	 * @description Getter/Setter property for column {observer_first_name}
	 */
	@Column({ name: AnimalObservationSchema.columns.observerFirstName})
	@ModelProperty({type: PropertyType.string})
	observerFirstName: string;

	/**
	 * @description Getter/Setter property for column {observer_last_name}
	 */
	@Column({ name: AnimalObservationSchema.columns.observerLastName})
	@ModelProperty({type: PropertyType.string})
	observerLastName: string;

	/**
	 * @description Getter/Setter property for column {number_of_individuals}
	 */
	@Column({name: AnimalObservationSchema.columns.numberOfIndividuals, transformer: new IntTransformer()})
	@ModelProperty({type: PropertyType.number})
	numberOfIndividuals: number;

	/**
	 * @description Getter/Setter property for column {comments}
	 */
	@Column({ name: AnimalObservationSchema.columns.comments})
	@ModelProperty({type: PropertyType.string})
	comments: string;

	/**
	 * @description Getter/Setter property for column {specimen_available_ind}
	 */
	@Column({ name: AnimalObservationSchema.columns.specimenAvailableIndicator})
	@ModelProperty({type: PropertyType.boolean})
	specimenAvailableIndicator: boolean;

	/**
	 * @description Getter/Setter property for column {animal_species_id}
	 */
	@ManyToOne( type => AnimalSpecies, { eager: true})
	@JoinColumn({ name: AnimalObservationSchema.columns.species, referencedColumnName: AnimalSpeciesSchema.pk})
	@ModelProperty({type: PropertyType.object})
	species: AnimalSpecies;

	/**
	 * @description Getter/Setter property for column {species_agency_code_id}
	 */
	@ManyToOne( type => SpeciesAgencyCode, { eager: true})
	@JoinColumn({ name: AnimalObservationSchema.columns.speciesAgency, referencedColumnName: SpeciesAgencyCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	speciesAgency: SpeciesAgencyCode;

	/**
	 * @description Getter/Setter property for column {life_stage_code_id}
	 */
	@ManyToOne( type => LifeStageCode, { eager: true})
	@JoinColumn({ name: AnimalObservationSchema.columns.lifeStage, referencedColumnName: LifeStageCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	lifeStage: LifeStageCode;

	/**
	 * @description Getter/Setter property for column {behaviour_code_id}
	 */
	@ManyToOne( type => BehaviourCode, { eager: true})
	@JoinColumn({ name: AnimalObservationSchema.columns.behaviour, referencedColumnName: BehaviourCodeSchema.pk})
	@ModelProperty({type: PropertyType.object})
	behaviour: BehaviourCode;

	/**
	 * @description Getter/Setter property for column {space_geom_id}
	 */
	@ManyToOne( type => SpaceGeom, { eager: true})
	@JoinColumn({ name: AnimalObservationSchema.columns.spaceGeom, referencedColumnName: SpaceGeomSchema.pk})
	@ModelProperty({type: PropertyType.object})
	spaceGeom: SpaceGeom;

}

// -------------------------------------
