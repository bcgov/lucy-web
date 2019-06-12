import { Injectable } from '@angular/core';
import { UserRole } from '../models/userRole';
import { ApiService } from './api.service';
import { AppConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})

export class RolesService {

  constructor(private api: ApiService) { }

  /**
   * Check if object is a UserRole 
   * @param role
   */
  private isRoleObject(role: any): role is UserRole {
    if (role === undefined || role === null) {return false}; 
    return (<UserRole>role.role) !== undefined;
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

  async getAllActiveRoles(): Promise<UserRole[] | null> {
    // var all = this.getDummyRoles();

    // all.forEach(function(item, index, object) {
    //   if (!item.enabled) {
    //     object.splice(index, 1);
    //   }
    // });

    // return all;

    const response = this.api.getCall(AppConstants.API_refrenceData.roles)
    return this.isValidRolesResponse(response)? response : null
  }

  private getDummyRoles(): UserRole[] {
    var roles: UserRole[] = [
      {
        createdAt: "2019-06-11T12:10:12.495Z",
        updateAt: "2019-06-11T12:10:12.495Z",
        role_code_id: 1,
        code: "ADM",
        role: "Admin",
        description: "Overall SEISM Access",
        enabled: true,
    },
    {
        createdAt: "2019-06-11T12:10:12.495Z",
        updateAt: "2019-06-11T12:10:12.495Z",
        role_code_id: 2,
        code: "DAV",
        role: "Data Viewer",
        description: "General data view access",
        enabled: true,
    },
    {
        createdAt: "2019-06-11T12:10:12.495Z",
        updateAt: "2019-06-11T12:10:12.495Z",
        role_code_id: 3,
        code: "DAE",
        role: "Data Editor",
        description: "General access",
        enabled: true,
    },
    {
        createdAt: "2019-06-11T12:10:12.495Z",
        updateAt: "2019-06-11T12:10:12.495Z",
        role_code_id: 4,
        code: "SUP",
        role: "Super User",
        description: "Lead admin for each of the taxonomic components",
        enabled: true,
    }
    ]
    return roles;
  } 
}
