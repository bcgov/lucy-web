import { Injectable } from '@angular/core';
import { User, UserAccessType, accessCode } from 'src/app/models';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { ApiService, APIRequestMethod, APIRequestResult } from './api.service';
import { AppConstants } from '../constants';
import { SsoService } from './sso.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private current: User | null = null;
  private APIPromise: Promise<APIRequestResult> | null = null;
  public shouldRefresh: boolean = false;

  constructor(private http: HttpClient, private cookieService: CookieService, private api: ApiService, private ssoService: SsoService) { }

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
   const userInfo = await this.requestUserInfo();
   return userInfo === null ? null : userInfo;
  }

  /*------------------------------------API CALL------------------------------------*/
  /**
   * Make an API Call through 
   * getUserRequestPromise() 
   * to get the current users informartion.
   * 
   * @returns User | null
   */
  private async requestUserInfo(): Promise<User | null> {
    const response = await this.getUserRequestPromise();
    // Reset promise
    this.APIPromise = null
    if (this.isUserObject(response.response)) {
      this.current = response.response;
      return response.response;
    } else {
      return null;
    }
  }

  /**
   * If a promise for the call is in progress, 
   * Return the same promise to avoid an extra call.
   * @returns Promise 
   */
  private async getUserRequestPromise():Promise<APIRequestResult> {
    if (this.APIPromise === null) {
      this.APIPromise = this.api.request(APIRequestMethod.GET, AppConstants.API_me, "");
    }
    return this.APIPromise
  }

  /**
   * Check if object is a User object
   * @param user 
   */
  private isUserObject(user: any): user is User {
    if (user === undefined || user === null) {return false}; 
    return (<User>user.email) !== undefined;
  }
  /*------------------------------------End of API Call------------------------------------*/

  /*------------------------------------GETs------------------------------------*/
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
      return UserAccessType.DataViewer;
    }
    switch (this.getUserAccessCode(user).code) {
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

  public getUserAccessCode(user: User): accessCode {
    return user.accessCodes[0];
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
  /*------------------------------------END OF GETs------------------------------------*/

  /*------------------------------------SETs------------------------------------*/
  /**
   * Update User information
   * @param firstName 
   * @param lastName 
   */
  async updateUserInfo(firstName: string, lastName: string): Promise<boolean> {
    let user = await this.getUser()
    user.firstName = firstName;
    user.lastName = lastName;
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_me, user);
    if (!this.isUserObject(response)) {
      return false
    } else {
      return (response.firstName === user.firstName && response.lastName === user.lastName)
    }
  }

  /**
   * Create an Access Request
   * @param notes 
   */
  async submitDataEntryRequest(notes: string): Promise<boolean> {
    let user = await this.getUser()
    // TODO: dont hardcode the id. use roles service.
    const body = {
      "requestedAccessCode": 3,
	    "requestNote": notes
    }
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_me, body);
    if (!this.isUserObject(response)) {
      return false
    } else {
      return (response.firstName === user.firstName && response.lastName === user.lastName)
    }
  }
  /*------------------------------------END OF SETs------------------------------------*/

  /*------------------------------------User Preferences------------------------------------*/
  /**
   * Check if a cookie named
   * ShowRequestDataEntryAccessMessage exists.
   *  * if not, 
   *    * user preference has not been saved: return true
   *  * if exists, 
   *    * check if value is not false
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

  /*------------------------------------ END OF User Preferences------------------------------------*/
  /*------------------------------------MOCK DATA------------------------------------*/
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
  /*------------------------------------END OF MOCK DATA------------------------------------*/

}