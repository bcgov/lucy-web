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
 * File: db.transformer.ts
 * Project: lucy
 * File Created: Monday, 29th July 2019 11:16:16 am
 * Author: pushan
 * -----
 * Last Modified: Monday, 29th July 2019 11:16:20 am
 * Modified By: pushan
 * -----
 */
import * as moment from 'moment';
/**
 * @file db.transformer.ts
 * @description Transformer classes for database
 */
 /**
  * @description Transformer for string to float number
  */

export class IntTransformer {
    to(data: number) {
        return data;
    }

    from(data: string) {
        return parseInt(data, undefined);
    }
}
export class NumericTransformer {
    to(data: number) {
        return data;
    }

    from(data: string) {
        return parseFloat(data);
    }
}

export class DateTransformer {
    to(date: any) {
        return date;
    }

    from(date: any) {
        if (typeof date === 'string') {
            return date;
        }
        try {
            const ds = `${moment(date).format('YYYY-MM-DD')}`;
            return ds;
        } catch (excp) {
            return `${date}`;
        }
    }
}

export class DateTimeTransformer {
    to(date: any) {
        return date;
    }

    from(date: any) {
        if (typeof date === 'string') {
            return date;
        }
        try {
            const ds = `${moment(date).format('YYYY-MM-DD HH:mm:ss')}`;
            return ds;
        } catch (excp) {
            return `${date}`;
        }
    }
}
// -------------------------------------------------------------------



