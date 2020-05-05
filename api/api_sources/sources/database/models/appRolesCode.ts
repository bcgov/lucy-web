//
// RoleCode DataModel
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
// Created by Pushan Mitra on 2019-06-02.
/**
 * Imports
 */
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
// Local Import
import { BaseModel } from './baseModel';
import { DataModelController } from '../data.model.controller';
import { RolesCodeTableSchema} from '../database-schema';
import { ModelDescription, ModelProperty, PropertyType } from '../../libs/core-model';

/**
 *
 * @description Value for different Access codes
 * @export enum RolesCodeValue
 */
export enum RolesCodeValue {
    admin = 'ADM',
    viewer  = 'DAV',
    editor = 'DAE',
    superUser = 'SUP',
    inspectAppOfficer = 'I_OFFICER',
    inspectAppAdmin = 'I_ADM'
}

/**
 * @description Entity model class for RoleCode
 * @export class RolesCode
 */
@Entity({
    name: RolesCodeTableSchema.schema.name
})
@ModelDescription({
	description: 'Data Model Class Role table schema',
	schema: RolesCodeTableSchema,
	apiResource: false
})
export class RolesCode extends BaseModel {
    @PrimaryGeneratedColumn()
    role_code_id: number;

    @Column({
        name: RolesCodeTableSchema.schema.columns.code
    })
    code: string;

    @Column({
        name: RolesCodeTableSchema.schema.columns.role
    })
    role: string;

    @Column({
        name: RolesCodeTableSchema.schema.columns.description
    })
    description: string;

    /**
	 * @description Getter/Setter property for column {active_ind}
	 */
	@Column({ name: RolesCodeTableSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

    get roleCode(): RolesCodeValue {
        return this.code as RolesCodeValue;
    }
}

/**
 * @description Data Model Controller for RoleCode
 * @export class RoleCodeController
 */
export class RoleCodeController extends DataModelController<RolesCode> {

    /**
     * @description Getter for shared instance
     */
    public static get shared(): RoleCodeController {
        return this.sharedInstance<RolesCode>(RolesCode, RolesCodeTableSchema) as RoleCodeController;
    }

    async getCode(code: RolesCodeValue): Promise<RolesCode> {
        const codeValue: RolesCode = await this.fetchOne({code: code}) || new this.entity();
        codeValue.code = code;
        return codeValue;
    }
}
// ----------------------------------------------------------------------------------------------------------------

