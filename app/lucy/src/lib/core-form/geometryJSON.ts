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
 * File: geometryJSON.ts
 * Project: lucy
 * File Created: Monday, 6th January 2020 10:52:05 am
 * Author: Pushan
 * -----
 * Last Modified: Monday, 6th January 2020 10:54:01 am
 * Modified By: Pushan
 * -----
 */

export interface GeometryAttributes {
    geomId?: number;
    area: {
        radius?: number;
        length?: number;
        width?: number;
    };
}

export interface InputGeometryJSON {
    attributes: GeometryAttributes;
    geoJSON: any;
}

export class GeometryJSON {
    static createGeometryJSON(geomId: number, dimensionX: number, dimensionY?: number) {
        const r = geomId === 1 ? dimensionX : undefined;
        const w = r === undefined ? dimensionX : undefined;
        return {
            attributes: {
                geomId: geomId,
                area: {
                    radius: r,
                    length: dimensionY,
                    width: w
                }
            },
            geoJSON: {}
        };
    }
}
// --------------------------------
