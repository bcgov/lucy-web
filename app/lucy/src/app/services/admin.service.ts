import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from './api.service';
import { AppConstants } from '../constants';
import { User} from '../models';
import { UserChangeResult } from './user.service';
import { ObjectValidatorService } from './object-validator.service';
import { AccessRequest } from '../models/accessRequest';
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
        return response.response
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  async respondToRequest(request: AccessRequest): Promise<boolean> {
    request.status = 1
    console.log("responding to request")
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_AcessRequestResponse(request.request_id), request);
    console.dir(response)
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
        return response.response
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  async changeUser(user: User, changes: any): Promise<UserChangeResult> {
    console.log("Changing user info:")
    console.log(changes)
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_user(user.user_id), changes);
    if (response.success && this.objectValidator.isUserObject(response.response)) {
      return {
        success: true,
        response: response.response
      }
    } else {
      return {
        success: false,
        response: null
      }
    }
  }

  async changeUserRole(user: User, accessCode: Role): Promise<UserChangeResult> {
    console.log("Selected Role: ")
    console.dir(accessCode)
    const body = {
      "roles": [accessCode.role_code_id],
    }
    return this.changeUser(user, body);
  }

  async changeUserAccountStatus(user: User, status: number): Promise<UserChangeResult> {
    const body = {
      "accountStatus": status,
    }
    return this.changeUser(user, body);
  }

  
}
