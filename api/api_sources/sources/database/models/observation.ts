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
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, AfterLoad } from 'typeorm';
import { Record } from './user';
import { ModelProperty, PropertyType } from '../../libs/core-model';
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


export interface ObservationCreateModel {
    lat: number;
    long: number;
    date: string;
    width: number;
    length: number;
    accessDescription: string;
    observerFirstName: string;
    observerLastName: string;
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

    /**
     * Model Behavior
     */
    @AfterLoad()
    entityDidLoad() {}
}
// -------------------------------------------------------------
