import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppConstants } from '../constants';
import { promise } from 'protractor';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private api: ApiService) { }

  async getAllUsers(): Promise<User[]> {
    const response = await this.api.getCall(AppConstants.API_allUsers)
    return response
  }
}
