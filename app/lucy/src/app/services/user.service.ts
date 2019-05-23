import { Injectable } from '@angular/core';
import {User, UserAccessType } from 'src/app/models';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { RemoteEndPointService } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  /**
   * Return a User object 
   * containing user information.
   */
  public async getUser(): Promise<User> {
    /* TODO: make api call,
    And before returning, 
    convert access code to enum using another call.
    */
    var user: User = {
      first: "Beth",
      last: "Bells",
      email: "Beth.bell@test.com",
      id: "666",
      access: UserAccessType.view,
      organization: "Ministry of Tranaportation",
      roleInOrganization: "Invasive Plant Specialist",
    };
    return user;
  }

  async getFullName(): Promise<string> {
    const user = await this.getUser()
    return (user.first + " " + user.last)
  }

  async getInitials(): Promise<string> {
    const user = await this.getUser()
    return (user.first.charAt(0) + user.last.charAt(0))
  }

  async getAccess(): Promise<UserAccessType> {
    const user = await this.getUser()
    let access: UserAccessType = user.access
    return access
  }

  async getOranizarionAndRole(): Promise<string> {
    const user = await this.getUser()
    return (user.roleInOrganization + ", " + user.organization);
  }

  /***** User Preferences *****/
  /**
   * Check if a cookie named
   * ShowRequestDataEntryAccessMessage exists.
   * if not, 
   * user preference has not been saved: return true
   * if exists, 
   * check if value is not false
   */
  public showRequestDataEntryAccessMessage(): boolean {
    const value = this.cookieService.get('ShowRequestDataEntryAccessMessage');
    if (value == "") {
      return true
    }
    return (value !== "false")
  }

  /**
   * Create a cookie named 
   * ShowRequestDataEntryAccessMessage
   * with the boolean value provided as string
   * @param show boolean
   */
  public setShowRequestDataEntryAccessMessage(show: boolean) {
    this.cookieService.set('ShowRequestDataEntryAccessMessage', String(show));
  }
}
