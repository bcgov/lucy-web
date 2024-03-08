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
import { Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ApiService, APIRequestMethod } from './api.service';
import { AppConstants } from '../constants';

@Injectable()
export class AppBootService {
    constructor(private api: HttpClient) {}
    async loadConfig(): Promise<void> {
        return new Promise(async res => {
            try {
                // Get config
                const result: any = await this.api.get('/config').toPromise();
                // Get API host
                const host = result.apiHost || 'localhost:7070';
                // Create base url
                const baseURL = `${location.protocol}//${host}/api`;
                // Setting base url to API const
                AppConstants.API_baseURL = baseURL;
                // Saving remote Config in app
                AppConstants.CONFIG = result;
                // Saving SSO info
                // URL
                AppConstants.SSOConstants.SSO_BASE_URL = result.sso.url || AppConstants.SSOConstants.SSO_BASE_URL;
                // Client Id
                AppConstants.SSOConstants.SSO_CLIENT_ID = result.sso.clientId || AppConstants.SSOConstants.SSO_CLIENT_ID;
                // Realm
                AppConstants.SSOConstants.SSO_REALM_NAME = result.sso.realm || AppConstants.SSOConstants.SSO_REALM_NAME;

                res();
            } catch (excp) {
                console.log(`Unable to load config due to excp ${excp}. Will use default config`);
                res();
            }
        });
    }
}

// -----------------------------------------------------------------------------------
