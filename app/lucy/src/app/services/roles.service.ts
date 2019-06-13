import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod } from './api.service';
import { AppConstants } from '../constants';
import { accessCode, User } from '../models';

@Injectable({
  providedIn: 'root'
})

export class RolesService {

  constructor(private api: ApiService) { }

  /**
   * Check if object is a UserRole 
   * @param role
   */
  private isRoleObject(role: any): role is accessCode {
    if (role === undefined || role === null) {return false}; 
    return (<accessCode>role.role) !== undefined;
  }

  private isValidRolesResponse(object: any): boolean {
    if (object === undefined || object === null) {
      return false;
    }
    return this.isRoleObject(object[0]);
  }

  // async getAllRoles(): Promise<UserRole[]> {
  //   const allRoles = await 
  //   return this.getDummyRoles();
  // }

  async getAllActiveRoles(): Promise<accessCode[] | null> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_refrenceData.roles, null);
    if (response.success) {
      return this.isValidRolesResponse(response.response)? response.response : null;
    } else {
      return null
    }
    
  }

  private getDummyRoles(): accessCode[] {
    var roles: accessCode[] = [
      {
        createdAt: "2019-06-11T12:10:12.495Z",
        updateAt: "2019-06-11T12:10:12.495Z",
        role_code_id: 1,
        code: "ADM",
        role: "Admin",
        description: "Overall SEISM Access",
    },
    {
        createdAt: "2019-06-11T12:10:12.495Z",
        updateAt: "2019-06-11T12:10:12.495Z",
        role_code_id: 2,
        code: "DAV",
        role: "Data Viewer",
        description: "General data view access",
    },
    {
        createdAt: "2019-06-11T12:10:12.495Z",
        updateAt: "2019-06-11T12:10:12.495Z",
        role_code_id: 3,
        code: "DAE",
        role: "Data Editor",
        description: "General access",
    },
    {
        createdAt: "2019-06-11T12:10:12.495Z",
        updateAt: "2019-06-11T12:10:12.495Z",
        role_code_id: 4,
        code: "SUP",
        role: "Super User",
        description: "Lead admin for each of the taxonomic components",
    }
    ]
    return roles;
  } 
}
