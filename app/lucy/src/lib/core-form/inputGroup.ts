/*
 * Copyright © 2019 Province of British Columbia
 * Licensed under the Apache License, Version 2.0 (the "License")
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * **
 * http://www.apache.org/licenses/LICENSE-2.0
 * **
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * File: inputGroup.ts
 * Project: lucy
 * File Created: Tuesday, 26th November 2019 10:33:09 am
 * Author: Pushan
 * -----
 * Last Modified: Tuesday, 26th November 2019 10:34:49 am
 * Modified By: Pushan
 * -----
 */

import { EventEmitter } from '@angular/core';

/**
 * Base Input Config
 */
export interface InputConfig {
    key: string;
    header: string;
    description: string;
    required: boolean;
    type: string;
    suffix: string;
    verification: any;
    meta: any;
    classNames: any;
    codeTable: string;
    codeTableMeta: {};
    displayKey: string;
    condition: string;
    value?: any;
    dropdown?: any;
    multiple?: boolean;
    embeddedFields?: {[key: string]: InputConfig};
}

/**
 * Remote Form Config Received from sever
 */
export interface RemoteFormConfig {
    idKey: string;
    schemaName: string;
    modelName: string;
    description: string;
    meta: {
        resource: boolean;
        api: string;
    };
    layout: {
        title: string;
        sections: {
        title: string;
        groups: {
            title: string;
            fields: string[];
            style: {};
        }[];
        }[];
    };
    computedFields: {

    };
    relations: {

    };
    fields: {
        key: string;
        layout: {
        header: string;
        description: string;
        classes: string[];
        };
        meta: {};
        type: number;
        suffix: string;
        verification: {};
        required: boolean;
    }[];
}

/**
 * Base Interface for input group
 */
export interface InputGroup {
    /**
     * Configuration Field
     */
    fields: InputConfig[];

    /**
     * Change in input
     */
    fieldChanges: EventEmitter<any>;

    /**
     * @description Get input values from inputs
     * @param any[] context: Any context to get input values from component
     */
    inputValues(...context: any[]): any;
}

/**
 * @description Base Class for input component
 */
export class InputGroupComponent implements InputGroup {
    // Fields
    fields: InputConfig[] = [];

    // Output
    fieldChanges: EventEmitter<any> = new EventEmitter<any>();

    // Default empty input values
    inputValues() {
        return {};
    }
}

/**
 * @description Base Class for Generic Input Component
 */
export class GenericInputGroupComponent<T> extends InputGroupComponent {
    // Output
    fieldChanges: EventEmitter<T> = new EventEmitter<T>();

    // Input values
    inputValues(): T {
        return {} as T;
    }
}

// ------------------------------------
