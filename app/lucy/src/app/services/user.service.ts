import { Injectable } from '@angular/core';
import { User, UserAccessType } from 'src/app/models';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { AppConstants } from '../constants';
import { SsoService } from './sso.service';
import { allowSanitizationBypass } from '@angular/core/src/sanitization/bypass';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private current: User | null = null;
  public shouldRefresh: boolean = false;

  constructor(private http: HttpClient, private cookieService: CookieService, private api: ApiService, private ssoService: SsoService) { }

  /**** Get ****/
  /**
   * Return a User object 
   * containing user information.
   */
  public async getUser(): Promise<User | null> {
    // If user is not authenticated,
    // reset chaced user and return null
    if (!this.ssoService.isAuthenticated()) {
      this.current = null;
      return null;
    }

    // If a chached user exists, return it
    if (this.isUserObject(this.current) && !this.shouldRefresh) {
      return this.current;
    }

    // Make the API call
    const response = await this.api.getCall(AppConstants.API_me);
    if (this.isUserObject(response)) {
      this.current = response;
      return response;
    } else {
      return null;
    }
  }

  /**
   * Check if object is a User object
   * @param user 
   */
  private isUserObject(user: any): user is User {
    if (user === undefined || user === null) {return false}; 
    return (<User>user.email) !== undefined;
  }

  async getFirstName(): Promise<string> {
    const user = await this.getUser();
    return (user == null ? "" :
      user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1));
  }

  async getLastName(): Promise<string> {
    const user = await this.getUser();
    return (user == null ? "" :
      user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1));
  }

  async getFullName(): Promise<string> {
    const user = await this.getUser();
    return (user == null ? "" :
      (user.firstName + " " + user.lastName));
  }

  async getInitials(): Promise<string> {
    const user = await this.getUser();
    return (user == null ? "" :
      (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase());
  }

  async getEmail(): Promise<string> {
    const user = await this.getUser();
    return (user == null ? "" :
      user.email);
  }

  async getAccess(): Promise<UserAccessType> {
    const user = await this.getUser();
    if (user == null) {
      console.log("User not found");
      return UserAccessType.DataViewer;
    }
    const userAccess = user.accessCodes[0];
    switch (userAccess.code) {
      case "ADM":
        return UserAccessType.Admin;
      case "DAV":
        return UserAccessType.DataViewer;
      case "DAE":
        return UserAccessType.DataEditor;
      case "SUP":
        return UserAccessType.SuperUser;
    }
  }

  // TODO: Does not exist in api yet
  async getOranizarionAndRole(): Promise<string> {
    // const user = await this.getUser();
    // return (user.roleInOrganization + ", " + user.organization);
    return "Invasive Plant Specialist, Ministry of Tranaportation";
  }

  // TODO: Does not exist in api yet
  async getOranization(): Promise<string> {
    // const user = await this.getUser();
    // return user.organization;
    return "Ministry of Tranaportation";
  }

  async basicInformationExists(): Promise<boolean> {
    const user = await this.getUser();
    if (user == null) {
      return false;
    }
    return (
      (user.firstName != "") &&
      (user.lastName != "") &&
      (user.email != "")
    );
  }
  /**** **** ****/

  /**** SET ****/
  async updateUserInfo(firstName: string, lastName: string): Promise<boolean> {
    let user = await this.getUser()
    user.firstName = firstName;
    user.lastName = lastName;
    const response = await this.api.putCall(AppConstants.API_me, JSON.parse(JSON.stringify(user)));
    if (!this.isUserObject(response)) {
      return false
    } else {
      return (response.firstName === user.firstName && response.lastName === user.lastName)
    }
  }

  async submitDataEntryRequest(): Promise<boolean> {
    let user = await this.getUser()
    const body = {
      "requestedAccessCode": 3,
	    "requestNote": ""
    }
    const response = await this.api.putCall(AppConstants.API_me, JSON.parse(JSON.stringify(user)));
    if (!this.isUserObject(response)) {
      return false
    } else {
      return (response.firstName === user.firstName && response.lastName === user.lastName)
    }
  }
  /**** **** ****/

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
      return true;
    };
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

  /**** Mock data ****/
  private getMockUser(): User {
    var user: User = {
      accessCodes: [{
        "code": "ADM",
        "createdAt": "2019-06-11T12:10:12.495Z",
        "description": "Overall SEISM Access",
        "role": "Admin",
        "role_code_id": 1,
        "updateAt": "2019-06-11T12:10:12.495Z",
      }],
      "createdAt": "2019-06-11T12:10:12.495Z",
      "currentSessionId": 1,
      "email": "amir@freshworks.io",
      "firstName": "Amir",
      "lastName": "Shayegh",
      "preferredUsername": "ashayega@idir",
      "updateAt": "2019-06-11T12:48:36.361Z",
      "user_id": 1,
    };
    return user
  }
  /**** **** ****/

}