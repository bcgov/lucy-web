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
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Record } from './user';
import { ObservationSchema } from '../database-schema';
import { ModelProperty, PropertyType } from '../../libs/core-model';
import { ObservationSpecies } from './observation.species';

@Entity({ name: ObservationSchema.dbTable})
export class Observation extends Record {
    @PrimaryGeneratedColumn()
    @ModelProperty({ type: PropertyType.number})
    observation_id: number;

    @Column({ name: ObservationSchema.columns.date, nullable: true})
    @ModelProperty({ type: PropertyType.date})
    date: Date;

    @Column({ name: ObservationSchema.columns.lat, nullable: false})
    @ModelProperty({ type: PropertyType.number})
    lat: number;

    @Column({ name: ObservationSchema.columns.long, nullable: false})
    @ModelProperty({ type: PropertyType.number})
    long: number;

    @OneToMany( type => ObservationSpecies, observationSpecies => observationSpecies.observation, {eager: true})
    @ModelProperty({ type: PropertyType.object, ref: 'ObservationSpecies'})
    speciesObservations: ObservationSpecies[];
}
// -------------------------------------------------------------
