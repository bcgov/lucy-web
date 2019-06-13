import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from './api.service';
import { AppConstants } from '../constants';
import { promise } from 'protractor';
import { User, accessCode } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private api: ApiService) { }

  async getAllUsers(): Promise<User[]> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_allUsers, null);
    if (response.success) {
      // TODO: Validate response
      return response.response
    } else {
      return null
    }
  }

  async changeUserRole(user: User, accessCode: accessCode): Promise<boolean> {
    const body = {
      "roles": [accessCode.role_code_id],
    }
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_user(user.user_id), body);
    if (response.success) {
      // TODO: Validate response
      return true
    } else {
      return false
    }
  }
}
