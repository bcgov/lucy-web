import { Injectable } from '@angular/core';
import { User} from 'src/app/models';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { ApiService, APIRequestMethod } from './api.service';
import { AppConstants } from '../constants';
import { SsoService } from './sso.service';
import { RolesService } from './roles.service';
import { ObjectValidatorService } from './object-validator.service';
import { Role, UserAccessType } from '../models/Role';

export interface UserChangeResult {
  success: boolean;
  response: User | null;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private current: User | null = null;
  public shouldRefresh = false;

  constructor(private http: HttpClient,
    private cookieService: CookieService,
    private api: ApiService,
    private ssoService: SsoService,
    private roles: RolesService,
    private objectValidator: ObjectValidatorService) { }

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
    if (this.objectValidator.isUserObject(this.current) && !this.shouldRefresh) {
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
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_me, ``);
    if (this.objectValidator.isUserObject(response.response)) {
      this.current = response.response;
      return response.response;
    } else {
      return null;
    }
  }
  /*------------------------------------End of API Call------------------------------------*/

  /*------------------------------------GETs------------------------------------*/
  /* Don't worry, you're not making a million API calls here. getUser() handles it. */

  /**
   * Get User's first name
   * @returns string
   */
  public async getFirstName(): Promise<string> {
    const user = await this.getUser();
    return (user == null ? `` :
      user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1));
  }

  /**
   * Get User's Last name
   * @returns string
   */
  public async getLastName(): Promise<string> {
    const user = await this.getUser();
    return (user == null ? `` :
      user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1));
  }

  /**
   * Get User's full name
   * @returns string
   */
  public async getFullName(): Promise<string> {
    const user = await this.getUser();
    return (user == null ? `` :
      (user.firstName + ` ` + user.lastName));
  }

  /**
   * Get User's initials name
   * @returns string
   */
  public async getInitials(): Promise<string> {
    const user = await this.getUser();
    return (user == null ? `` :
      (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase());
  }

  /**
   * Get User's Email
   * @returns string
   */
  public async getEmail(): Promise<string> {
    const user = await this.getUser();
    return (user == null ? `` :
      user.email);
  }

  /**
   * Get Users Access Type.
   * Determined based on User's
   * Access Code.
   * @returns UserAccessType
   */
  public async getAccess(): Promise<UserAccessType> {
    const user = await this.getUser();
    if (user == null) {
      return UserAccessType.DataViewer;
    }
    return this.roles.roleToAccessType(this.getUserAccessCode(user));
  }

  /**
   * Return User's relevant access code.
   * @param user object
   * @returns accessCode
   */
  public getUserAccessCode(user: User): Role {
    return user.roles[user.roles.length - 1];
  }

  // TODO: Does not exist in api yet
  public async getOranizarionAndRole(): Promise<string> {
    // const user = await this.getUser();
    // return (user.roleInOrganization + ", " + user.organization);
    return `Invasive Plant Specialist, Ministry of Tranaportation`;
  }

  // TODO: Does not exist in api yet
  public async getOranization(): Promise<string> {
    // const user = await this.getUser();
    // return user.organization;
    return `Ministry of Tranaportation`;
  }

  /**
   * Checks if user's basic information exists.
   * @returns boolean
   */
  public async basicInformationExists(): Promise<boolean> {
    const user = await this.getUser();
    if (user == null) {
      return false;
    }
    return (
      (user.firstName !== ``) &&
      (user.lastName !== ``)
    );
  }
  /*------------------------------------END OF GETs------------------------------------*/

  /*------------------------------------SETs------------------------------------*/
  /**
   * Update User information
   * @param firstName string
   * @param lastName string
   * @returns boolean
   */
  async updateUserInfo(firstName: string, lastName: string): Promise<boolean> {
    const user = await this.getUser();
    user.firstName = firstName;
    user.lastName = lastName;
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_me, user);
    if (response.success) {
      if (!this.objectValidator.isUserObject(response.response)) {
        return false;
      } else {
        return (response.response.firstName === user.firstName && response.response.lastName === user.lastName)
      }
    } else {
      return false;
    }
  }

  /**
   * Create an Access Request
   * @param notes string
   * @returns boolean
   */
  async submitDataEntryRequest(notes: string): Promise<boolean> {
    const user = await this.getUser();
    const dataEntryRole = await this.roles.getDataEntryRole();
    if (dataEntryRole === null) {
      console.log(`Could not fetch data entry role`);
      return false;
    }
    const body = {
      requestedAccessCode: dataEntryRole.role_code_id,
      requestNote: notes
    }
    const response = await this.api.request(APIRequestMethod.POST, AppConstants.API_DataEntryAccessRequest, body);
    if (!this.objectValidator.isUserObject(response)) {
      return false;
    } else {
      return (response.firstName === user.firstName && response.lastName === user.lastName);
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
   * @returns boolean
   */
  public showRequestDataEntryAccessMessage(): boolean {
    const value = this.cookieService.get('ShowRequestDataEntryAccessMessage');
    if (value === ``) {
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
      roles: [{
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
      "accountStatus": 1.
    };
    return user
  }
  /*------------------------------------END OF MOCK DATA------------------------------------*/

}