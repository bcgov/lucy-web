/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */

declare const window: any;

class RemoteEndPoints {

    private static instance: RemoteEndPoints;

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    get origin(): string {
        return window.location.origin || `http://localhost`;
    }

    get baseURL(): string {
        return `${this.origin}/api/v1`;
    }

    get usetInfo(): string {
        return this.baseURL + `/userInfo`;
    }

    get categories(): string {
        return this.baseURL + `/categories`;
    }

    get users(): string {
        return this.baseURL + `/users`;
    }

    get species(): string {
        return this.baseURL + `/species`;
    }
}

export const RemoteEndPointService = RemoteEndPoints.getInstance();
