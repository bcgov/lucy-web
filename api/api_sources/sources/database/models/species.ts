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
// Created by Pushan Mitra on 2019-07-03.
/**
 * Imports
 */
import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { Record } from './generic.data.models';
import { SpeciesSchema } from '../database-schema';

/**
 * @description Model class for species
 */
@Entity({
    name: SpeciesSchema.schema.name
})
@ModelDescription({
    description: 'Data Model Class for SpeciesSchema',
	schema: SpeciesSchema,
	apiResource: false
})
export class Species extends Record {
    @PrimaryGeneratedColumn()
    @ModelProperty({type: PropertyType.number})
    species_id: number;

    @Column({
        name: SpeciesSchema.schema.columns.mapCode,
        nullable: true
    })
    @ModelProperty({type: PropertyType.string})
    mapCode: string;

    @Column({
        name: SpeciesSchema.schema.columns.earlyDetection,
        nullable: true
    })
    @ModelProperty({type: PropertyType.boolean})
    earlyDetection: number;

    @Column({
        name: SpeciesSchema.schema.columns.cmt,
        nullable: true
    })
    @ModelProperty({type: PropertyType.number})
    containmentSpecies: number;

    @Column({
        name: SpeciesSchema.schema.columns.shp,
        nullable: true
    })
    @ModelProperty({type: PropertyType.number})
    containmentSpacialRef: number;

    @Column({
        name: SpeciesSchema.schema.columns.species,
        nullable: true
    })
    @ModelProperty({type: PropertyType.string})
    species: string;

    @Column({
        name: SpeciesSchema.schema.columns.genus,
        nullable: true
    })
    @ModelProperty({type: PropertyType.string})
    genus: string;

    @Column({
        name: SpeciesSchema.schema.columns.commonName,
        nullable: true
    })
    @ModelProperty({type: PropertyType.string})
    commonName: string;

    @Column({
        name: SpeciesSchema.schema.columns.latinName,
        nullable: true
    })
    @ModelProperty({type: PropertyType.string})
    latinName: string;
}

// -------------------------------------------------------------
