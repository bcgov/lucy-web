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
 * File: string.util.ts
 * Project: lucy
 * File Created: Thursday, 14th November 2019 2:08:25 pm
 * Author: pushan (you@you.you)
 * -----
 * Last Modified: Thursday, 14th November 2019 2:08:44 pm
 * Modified By: pushan (you@you.you>)
 * -----
 */
/**
 * @description Split String to based on camel case
 * @param string input
 */
export const splitCamelCase = (input: string): string[] => {
    return input.split(/(?=[A-Z])/);
};

/**
 * @description Split and convert camel case string to lowercase string array
 * @param string input
 */
export const splitCamelCaseInLower = (input: string): string[] => {
    return input.split(/(?=[A-Z])/).map( s => s.toLocaleLowerCase());
};

/**
 * @description Convert camel case string to snake case
 * @param string input
 */
export const camelToSnakeCase = (str: string) => {
  const r = str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  if (r.charAt(0) === '_') {
    return r.substr(1);
  }
  return r;
};

/**
 * @description Convert snake case string to camel case
 * @param string input
 */
export const snakeToCamelCase = (s: string) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  };

// -------------------------
