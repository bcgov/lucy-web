/**
 * Copyright 2019 Province of British Columbia
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AppRoutes} from '../constants/app-routes.enum';
import { RemoteAPIStatus } from '../models';
import { HttpHeaders } from '@angular/common/http';


export class Utility {
   // Share Instance
   private static instance: Utility;


   // Get Share Instance
   public static getInstance() {
       return this.instance || (this.instance = new this());
   }

   public appRoute(route: AppRoutes): string {
       return `/${route}`;
   }

   public createAPIStatus(status: boolean, message: string): RemoteAPIStatus {
       const apiStatus: RemoteAPIStatus = {
           success: status,
           message: message
       };
       return apiStatus;
   }

}

export const UtilityService = Utility.getInstance();
