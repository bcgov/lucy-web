//
// Common Error Handlers
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
// Created by Pushan Mitra on 2019-06-6.
/**
 * Imports
 */
import { LoggerBase } from '../logger';

/**
 * @description Express global error handle
 * @param any error
 * @param express.Request req
 * @param express.Response res
 * @param any? next Closure to move beyond validation
 */
export const errorHandler = (error: any, req: any, res: any, next?: any ) => {
    LoggerBase.logger.error(`Application unhandled error: ${error.message}`);
    let code = 500;
    // Checking code is valid http status or not
    if (typeof error.code === 'number' && error.code >= 100 && error.code <= 511) {
        ({ code } = error);
    }

    // Getting message from error.
    const message = error.message ? error.message : 'Internal Server Error';

    // Sending error status.
    res.status(code).json({ message: message, time: Date(), errors: [error]});
};
/**
 * @description Create Common Error message json
 * @param string message Error Message
 * @param objects[] errors Array or errors
 */
export const errorBody = (message: string, errors: object[]) => {
    return {
        message,
        time: Date(),
        errors
    };
};
// -----------------------------------------------------------------------------------------------------------
