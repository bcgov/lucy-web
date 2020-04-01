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
 * File: logger.ts
 * Project: lucy
 * File Created: Monday, 18th November 2019 11:46:03 am
 * Author: Pushan  (you@you.you)
 * -----
 * Last Modified: Monday, 18th November 2019 11:46:21 am
 * Modified By: Pushan  (you@you.you>)
 * -----
 */
export interface BaseLogger {
    log(start: string, ...other: any[]): any;
    info(start: string, ...other: any[]): any;
    warning(start: string, ...other: any[]): any;
    error(start: string, ...other: any[]): any;

}

/**
 * @description Dynamic log provider
 */
export type LogProvider = () => BaseLogger;

export const DefaultLogger = {
    log: (start: string, ...other: any[]) => {},
    info: (start: string, ...other: any[]) => {},
    warning: (start: string, ...other: any[]) => {
        return console.warn.apply(console, [start, ...other]);
    },
    error: (start: string, ...other: any[]) => {
        return console.error.apply(console, [start, ...other]);
    }
};
// ----------------------------
