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
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { Record } from './user';
import { ModelProperty, PropertyType } from '../../libs/core-model';
import { Species } from './species';
import { JurisdictionCode } from './observation.codes';
import { Observation } from './observation';
import { SpeciesDensityCode } from './speciesDensity.code';
import { SpeciesDistributionCode } from './speciesDistribution.code';
import {
    ObservationSpeciesSchema,
    SpeciesSchema,
    JurisdictionCodeSchema,
    ObservationSchema,
    SpeciesDensityCodeSchema,
    SpeciesDistributionCodeSchema,
    SurveyTypeCodeSchema,
    SpeciesAgencyCodeSchema
     } from '../database-schema';
import { SurveyTypeCode } from './surveyType.code';
import { SpeciesAgencyCode } from './speciesAgency.code';

export interface ObservationSpeciesCreateModel {
    width: number;
    length: number;
    accessDescription: string;
    surveyorFirstName: string;
    surveyorLastName: string;
    species: Species;
    jurisdiction: JurisdictionCode;
    observation: Observation;
    density: SpeciesDensityCode;
    distribution: SpeciesDistributionCode;
    surveyType: SurveyTypeCode;
    speciesAgency: SpeciesAgencyCode;
}

export interface ObservationSpeciesUpdateModel {
    width?: number;
    length?: number;
    accessDescription?: string;
    surveyorFirstName?: string;
    surveyorLastName?: string;
    species?: Species;
    jurisdiction?: JurisdictionCode;
    observation?: Observation;
    density?: SpeciesDensityCode;
    distribution?: SpeciesDistributionCode;
    surveyType?: SurveyTypeCode;
    speciesAgency?: SpeciesAgencyCode;
}
@Entity({ name: ObservationSpeciesSchema.dbTable})
export class ObservationSpecies extends Record implements ObservationSpeciesCreateModel {
    @PrimaryGeneratedColumn()
    @ModelProperty({ type: PropertyType.number})
    observation_species_id: number;


    @Column({ name: ObservationSpeciesSchema.columns.width, nullable: false})
    @ModelProperty({ type: PropertyType.number})
    width: number;

    @Column({ name: ObservationSpeciesSchema.columns.length, nullable: false})
    @ModelProperty({ type: PropertyType.number})
    length: number;

    @Column({ name: ObservationSpeciesSchema.columns.accessDescription, nullable: false})
    @ModelProperty({ type: PropertyType.string})
    accessDescription: string;

    @Column({ name: ObservationSpeciesSchema.columns.surveyorFirstName})
	@ModelProperty({type: PropertyType.string})
	surveyorFirstName: string;

	@Column({ name: ObservationSpeciesSchema.columns.surveyorLastName})
	@ModelProperty({type: PropertyType.string})
	surveyorLastName: string;

    @ManyToOne( type => Species, {eager: true})
    @JoinColumn({
        name: ObservationSpeciesSchema.columns.species,
        referencedColumnName: SpeciesSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    species: Species;

    @ManyToOne( type => JurisdictionCode, {eager: true})
    @JoinColumn({
        name: ObservationSpeciesSchema.columns.jurisdiction,
        referencedColumnName: JurisdictionCodeSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    jurisdiction: JurisdictionCode;

    @ManyToOne( type => SpeciesDensityCode, {eager: true})
    @JoinColumn({
        name: ObservationSpeciesSchema.columns.density,
        referencedColumnName: SpeciesDensityCodeSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    density: SpeciesDensityCode;

    @ManyToOne( type => SpeciesDistributionCode, {eager: true})
    @JoinColumn({
        name: ObservationSpeciesSchema.columns.distribution,
        referencedColumnName: SpeciesDistributionCodeSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    distribution: SpeciesDistributionCode;

    @ManyToOne( type => SurveyTypeCode, {eager: true})
    @JoinColumn({
        name: ObservationSpeciesSchema.columns.surveyType,
        referencedColumnName: SurveyTypeCodeSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    surveyType: SurveyTypeCode;

    @ManyToOne( type => SpeciesAgencyCode, {eager: true})
    @JoinColumn({
        name: ObservationSpeciesSchema.columns.speciesAgency,
        referencedColumnName: SpeciesAgencyCodeSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    speciesAgency: SpeciesAgencyCode;

    @ManyToOne( type => Observation)
    @JoinColumn({
        name: ObservationSpeciesSchema.columns.observation,
        referencedColumnName: ObservationSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    observation: Observation;
}
// -------------------------------------------------------------
