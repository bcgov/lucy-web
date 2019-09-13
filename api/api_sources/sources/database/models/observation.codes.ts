//
// Code data model for observation model
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
// Created by Pushan Mitra on 2019-05-10.
/**
 * Imports
 */
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { ApplicationCode } from './generic.data.models';
import { ModelProperty, PropertyType } from '../../libs/core-model';
import { JurisdictionCodeSchema } from '../database-schema';

@Entity( { name: JurisdictionCodeSchema.dbTable} )
export class JurisdictionCode extends ApplicationCode {
    @PrimaryGeneratedColumn()
    @ModelProperty( {type: PropertyType.number})
    jurisdiction_code_id: number;

    @Column({ name: JurisdictionCodeSchema.columns.code, nullable: false})
    @ModelProperty( {type: PropertyType.string})
    code: string;
}
// -------------------------------------------------------------

