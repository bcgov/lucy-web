import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants';
import { promise } from 'protractor';
import { User, accessCode } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private api: ApiService) { }

  async getAllUsers(): Promise<User[]> {
    const response = await this.api.getCall(AppConstants.API_allUsers)
    return response
  }

  async changeUserRole(user: User, accessCode: accessCode): Promise<boolean> {
    const body = {
      "roles": [accessCode.role_code_id],
    }
    const response = await this.api.putCall(AppConstants.API_user(user.user_id), body)
    console.log(response)
    return true
  }
}
