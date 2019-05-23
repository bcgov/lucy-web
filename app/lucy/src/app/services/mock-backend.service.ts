import { Injectable } from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import {User, UserAccessType } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class MockBackendService implements InMemoryDbService {

  // https://www.smashingmagazine.com/2018/11/a-complete-guide-to-routing-in-angular/
  constructor() { }

  createDb() {
    let userInfo = this.getUserInfo()
    let accessLevelTable = this.getAccessLevelTable()
 
    return {userInfo, accessLevelTable};
   }

   /**
   * Return user's info
   */
  public getUserInfo() {
    return {
      first: "Beth",
      last: "Bells",
      email: "Beth.bell@test.com",
      id: "666",
      access: "1",
      organization: "Ministry of Tranaportation",
      roleInOrganization: "Invasive Plant Specialist",
    };
  }

  /**
   * Table of access levels
   */
  public getAccessLevelTable() {
    return  [
      {  id:  1,  name:  'View'},
      {  id:  2,  name:  'Data Entry'},
      {  id:  3,  name:  'Admin'}
    ];
  }


}
