import { Injectable } from '@angular/core';
import { userRole } from '../models/userRole';

@Injectable({
  providedIn: 'root'
})

export class RolesService {

  constructor() { }

  async getAllRoles(): Promise<userRole[]> {
    return this.getDummyRoles();
  }

  async getAllActiveRoles(): Promise<userRole[]> {
    var all = this.getDummyRoles();

    all.forEach(function(item, index, object) {
      if (!item.enabled) {
        object.splice(index, 1);
      }
    });

    return all;
  }

  private getDummyRoles(): userRole[] {
    var roles: userRole[] = [
      {
        id: 0,
        name: "Data Viewer",
        description: "View Only Access to Database",
        enabled: true,
      },
      {
        id: 1,
        name: "Data Editor",
        description: "Can Add Observations to Database",
        enabled: true,
      },
      {
        id: 2,
        name: "Super Admin",
        description: "Can Manage Users and Entries in the Database",
        enabled: true,
      }
    ]
    return roles;
  } 
}
