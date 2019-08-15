//
// Species DataModel
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-07-05.
/**
 * Imports
 */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, AfterLoad, OneToMany } from 'typeorm';
import { Record } from './user';
import { ModelProperty, PropertyType, ClassDescription } from '../../libs/core-model';
import { ObservationTypeCode } from './observationType.code';
import { SpeciesAgencyCode } from './speciesAgency.code';
import { SoilTextureCode } from './soilTexture.code';
import { ObservationGeometryCode } from './observationGeometry.code';
import { SpecificUseCode } from './specificUse.code';
import { Species } from './species';
import { JurisdictionCode } from './observation.codes';
import { SpeciesDensityCode } from './speciesDensity.code';
import { SpeciesDistributionCode } from './speciesDistribution.code';
import { SlopeCode } from './slope.code';
import { AspectCode } from './observationAspect.code';
import { ProposedActionCode } from './proposedAction.code';
import {
    SpeciesSchema,
    JurisdictionCodeSchema,
    ObservationSchema,
    SpeciesDensityCodeSchema,
    SpeciesDistributionCodeSchema,
    ObservationTypeCodeSchema,
    SpeciesAgencyCodeSchema,
    SoilTextureCodeSchema,
    ObservationGeometryCodeSchema,
    SpecificUseCodeSchema,
    SlopeCodeSchema,
    AspectCodeSchema,
    ProposedActionCodeSchema
} from '../database-schema';
import { NumericTransformer } from '../../libs/transformer';
import { MechanicalTreatment } from './mechanical.treatment';


export interface ObservationCreateModel {
    lat: number;
    long: number;
    date: string;
    width: number;
    length: number;
    accessDescription: string;
    observerFirstName: string;
    observerLastName: string;
    sampleIdentifier?: string;
    rangeUnitNumber?: string;
	legacySiteIndicator?: boolean;
	edrrIndicator?: boolean;
	researchIndicator?: boolean;
	sampleTakenIndicator?: boolean;
	wellIndicator?: boolean;
	specialCareIndicator?: boolean;
	biologicalIndicator?: boolean;
	aquaticIndicator?: boolean;

    species: Species;
    jurisdiction: JurisdictionCode;
    density: SpeciesDensityCode;
    distribution: SpeciesDistributionCode;
    observationType: ObservationTypeCode;
    speciesAgency: SpeciesAgencyCode;
    soilTexture: SoilTextureCode;
    observationGeometry: ObservationGeometryCode;
    specificUseCode: SpecificUseCode;
    slopeCode: SlopeCode;
    aspectCode: AspectCode;
    proposedAction: ProposedActionCode;
}

export interface ObservationUpdateModel {
    lat?: number;
    long?: number;
    date?: string;
    width?: number;
    length?: number;
    accessDescription?: string;
    observerFirstName?: string;
    observerLastName?: string;
    sampleIdentifier?: string;
    rangeUnitNumber?: string;
	legacySiteIndicator?: boolean;
	edrrIndicator?: boolean;
	researchIndicator?: boolean;
	sampleTakenIndicator?: boolean;
	wellIndicator?: boolean;
	specialCareIndicator?: boolean;
	biologicalIndicator?: boolean;
	aquaticIndicator?: boolean;
    species?: Species;
    jurisdiction?: JurisdictionCode;
    density?: SpeciesDensityCode;
    distribution?: SpeciesDistributionCode;
    observationType?: ObservationTypeCode;
    speciesAgency?: SpeciesAgencyCode;
    soilTexture?: SoilTextureCode;
    observationGeometry?: ObservationGeometryCode;
    specificUseCode?: SpecificUseCode;
    slopeCode?: SlopeCode;
    aspectCode?: AspectCode;
    proposedAction?: ProposedActionCode;
}

@Entity({ name: ObservationSchema.dbTable})
@ClassDescription({
    description: 'Observation Model class',
    schema: ObservationSchema,
    apiResource: true
})
export class Observation extends Record implements ObservationCreateModel {
    @PrimaryGeneratedColumn()
    @ModelProperty({ type: PropertyType.number})
    observation_id: number;

    @Column({ name: ObservationSchema.columns.date, nullable: true})
    @ModelProperty({ type: PropertyType.string})
    date: string;

    @Column({ name: ObservationSchema.columns.lat,
        nullable: false,
        transformer: new NumericTransformer()
    })
    @ModelProperty({ type: PropertyType.number})
    lat: number;

    @Column({ name: ObservationSchema.columns.long,
        nullable: false,
        transformer: new NumericTransformer()
    })
    @ModelProperty({ type: PropertyType.number})
    long: number;

    @Column({ name: ObservationSchema.columns.width, nullable: false})
    @ModelProperty({ type: PropertyType.number})
    width: number;

    @Column({ name: ObservationSchema.columns.length, nullable: false})
    @ModelProperty({ type: PropertyType.number})
    length: number;

    @Column({ name: ObservationSchema.columns.accessDescription, nullable: false})
    @ModelProperty({ type: PropertyType.string})
    accessDescription: string;

    @Column({ name: ObservationSchema.columns.observerFirstName})
	@ModelProperty({type: PropertyType.string})
	observerFirstName: string;

	@Column({ name: ObservationSchema.columns.observerLastName})
	@ModelProperty({type: PropertyType.string})
    observerLastName: string;

    /**
	 * @description Getter/Setter property for column {sample_identifier}
	 */
	@Column({ name: ObservationSchema.columns.sampleIdentifier, nullable: true})
	@ModelProperty({type: PropertyType.string})
	sampleIdentifier?: string;

	/**
	 * @description Getter/Setter property for column {range_unit_number}
	 */
	@Column({ name: ObservationSchema.columns.rangeUnitNumber, nullable: true})
	@ModelProperty({type: PropertyType.string})
	rangeUnitNumber?: string;

	/**
	 * @description Getter/Setter property for column {legacy_site_ind}
	 */
	@Column({ name: ObservationSchema.columns.legacySiteIndicator})
	@ModelProperty({type: PropertyType.boolean})
	legacySiteIndicator: boolean;

	/**
	 * @description Getter/Setter property for column {early_detection_rapid_resp_ind}
	 */
	@Column({ name: ObservationSchema.columns.edrrIndicator})
	@ModelProperty({type: PropertyType.boolean})
	edrrIndicator: boolean;

	/**
	 * @description Getter/Setter property for column {research_detection_ind}
	 */
	@Column({ name: ObservationSchema.columns.researchIndicator})
	@ModelProperty({type: PropertyType.boolean})
	researchIndicator: boolean;

	/**
	 * @description Getter/Setter property for column {sample_taken_ind}
	 */
	@Column({ name: ObservationSchema.columns.sampleTakenIndicator})
	@ModelProperty({type: PropertyType.boolean})
	sampleTakenIndicator: boolean;

	/**
	 * @description Getter/Setter property for column {well_ind}
	 */
	@Column({ name: ObservationSchema.columns.wellIndicator})
	@ModelProperty({type: PropertyType.boolean})
	wellIndicator: boolean;

	/**
	 * @description Getter/Setter property for column {special_care_ind}
	 */
	@Column({ name: ObservationSchema.columns.specialCareIndicator})
	@ModelProperty({type: PropertyType.boolean})
	specialCareIndicator: boolean;

	/**
	 * @description Getter/Setter property for column {biological_ind}
	 */
	@Column({ name: ObservationSchema.columns.biologicalIndicator})
	@ModelProperty({type: PropertyType.boolean})
	biologicalIndicator: boolean;

	/**
	 * @description Getter/Setter property for column {aquatic_ind}
	 */
	@Column({ name: ObservationSchema.columns.aquaticIndicator})
	@ModelProperty({type: PropertyType.boolean})
	aquaticIndicator: boolean;

    // Relationships
    @ManyToOne( type => Species, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.species,
        referencedColumnName: SpeciesSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    species: Species;

    @ManyToOne( type => JurisdictionCode, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.jurisdiction,
        referencedColumnName: JurisdictionCodeSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    jurisdiction: JurisdictionCode;

    @ManyToOne( type => SpeciesDensityCode, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.density,
        referencedColumnName: SpeciesDensityCodeSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    density: SpeciesDensityCode;

    @ManyToOne( type => SpeciesDistributionCode, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.distribution,
        referencedColumnName: SpeciesDistributionCodeSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    distribution: SpeciesDistributionCode;

    @ManyToOne( type => ObservationTypeCode, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.observationType,
        referencedColumnName: ObservationTypeCodeSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    observationType: ObservationTypeCode;

    @ManyToOne( type => SpeciesAgencyCode, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.speciesAgency,
        referencedColumnName: SpeciesAgencyCodeSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    speciesAgency: SpeciesAgencyCode;

    @ManyToOne( type => SoilTextureCode, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.soilTexture,
        referencedColumnName: SoilTextureCodeSchema.columns.id
    })
	@ModelProperty({type: PropertyType.object})
	soilTexture: SoilTextureCode;

    @ManyToOne( type => ObservationGeometryCode, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.observationGeometry,
        referencedColumnName: ObservationGeometryCodeSchema.columns.id
    })
	@ModelProperty({type: PropertyType.object})
	observationGeometry: ObservationGeometryCode;

    @ManyToOne( type => SpecificUseCode, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.specificUseCode,
        referencedColumnName: SpecificUseCodeSchema.columns.id
    })
	@ModelProperty({type: PropertyType.object})
    specificUseCode: SpecificUseCode;

    @ManyToOne( type => SlopeCode, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.slopeCode,
        referencedColumnName: SlopeCodeSchema.columns.id
    })
	@ModelProperty({type: PropertyType.object})
    slopeCode: SlopeCode;

    @ManyToOne( type => AspectCode, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.aspectCode,
        referencedColumnName: AspectCodeSchema.columns.id
    })
	@ModelProperty({type: PropertyType.object})
    aspectCode: AspectCode;

    @ManyToOne( type => ProposedActionCode, {eager: true})
    @JoinColumn({
        name: ObservationSchema.columns.proposedAction,
        referencedColumnName: ProposedActionCodeSchema.columns.id
    })
	@ModelProperty({type: PropertyType.object})
    proposedAction: ProposedActionCode;

    // Calculated Properties
    @OneToMany(
        type => MechanicalTreatment,
        mechanicalTreatment => mechanicalTreatment.observation
    )
    getMechanicalTreatments: Promise<MechanicalTreatment[]>;

    @ModelProperty({type: PropertyType.array, $ref: '#/definitions/MechanicalTreatment'})
    mechanicalTreatments?: MechanicalTreatment[];

    /**
     * Model Behavior
     */
    @AfterLoad()
    async entityDidLoad() {
        this.mechanicalTreatments = await this.getMechanicalTreatments;
    }
}
// -------------------------------------------------------------
