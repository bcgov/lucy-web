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
import { ObservationSpeciesSchema, SpeciesSchema, JurisdictionCodeSchema, ObservationSchema } from '../database-schema';
import { ModelProperty, PropertyType } from '../../libs/core-model';
import { Species } from './species';
import { JurisdictionCode } from './observation.codes';
import { Observation } from './observation';

@Entity({ name: ObservationSpeciesSchema.name})
export class ObservationSpecies extends Record {
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

    @ManyToOne( type => Species)
    @JoinColumn({
        name: ObservationSpeciesSchema.columns.species,
        referencedColumnName: SpeciesSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    species: Species;

    @ManyToOne( type => JurisdictionCode)
    @JoinColumn({
        name: ObservationSpeciesSchema.columns.jurisdiction,
        referencedColumnName: JurisdictionCodeSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    jurisdiction: JurisdictionCode;

    @ManyToOne( type => Observation)
    @JoinColumn({
        name: ObservationSpeciesSchema.columns.observation,
        referencedColumnName: ObservationSchema.columns.id
    })
    @ModelProperty({ type: PropertyType.object})
    observation: Observation;
}
// -------------------------------------------------------------
