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
import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from './api.service';
import { AppConstants } from '../constants';
import { User} from '../models';
import { UserChangeResult } from './user.service';
import { ObjectValidatorService } from './object-validator.service';
import { AccessRequest } from '../models/AccessRequest';
import { Role } from '../models/Role';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  constructor(private api: ApiService, private objectValidator: ObjectValidatorService) { }

  async getRequests(): Promise<AccessRequest[]> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_DataEntryAccessRequest, null);
    if (response.success) {
      if ((Array.isArray(response.response) && this.objectValidator.isAccessRequestObject(response.response[0]))) {
        return response.response;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  async respondToRequest(request: AccessRequest, approved: boolean): Promise<boolean> {
    const body = {
      requestedAccessCode: request.requester.roles[0].role_code_id,
      status: approved ? 1 : 2,
      approverNote: request.approverNote || ''
    };
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_AcessRequestResponse(request.request_id), body);
    if (response.success) {
      return true;
    } else {
      return false;
    }
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_allUsers, null);
    if (response.success) {
      if (Array.isArray(response.response) && this.objectValidator.isUserObject(response.response[0])) {
        return response.response;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  async changeUser(user: User, changes: any): Promise<UserChangeResult> {
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_user(user.user_id), changes);
    if (response.success && this.objectValidator.isUserObject(response.response)) {
      return {
        success: true,
        response: response.response
      };
    } else {
      return {
        success: false,
        response: null
      };
    }
  }

  async changeUserRole(user: User, accessCode: Role): Promise<UserChangeResult> {
    const body = {
      'roles': [accessCode.role_code_id],
    };
    return this.changeUser(user, body);
  }

  async changeUserAccountStatus(user: User, status: number, isAdmin: boolean): Promise<UserChangeResult> {
    // If the account status is inactive, set the role to `Data viewer`
    const body = {
      accountStatus: status,
      ...((!status && isAdmin) && { roles: [2] })
    };
    return this.changeUser(user, body);
  }

}
