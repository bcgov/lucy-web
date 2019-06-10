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

  /**** Get ****/
  /**
   * Return a User object 
   * containing user information.
   */
  public async getUser(): Promise<User> {
    /* TODO: make api call,
    And before returning, 
    convert access code to enum using another call.
    */
    this.createMockUser()
    return this.getMockUser();
  }
  
  async getFirstName(): Promise<string> {
    const user = await this.getUser();
    return user.first.charAt(0).toUpperCase() + user.first.slice(1);
  }

  async getLastName(): Promise<string> {
    const user = await this.getUser();
    return user.last.charAt(0).toUpperCase() + user.last.slice(1); 
  }

  async getFullName(): Promise<string> {
    const user = await this.getUser();
    return (user.first + " " + user.last);
  }

  async getInitials(): Promise<string> {
    const user = await this.getUser();
    return (user.first.charAt(0) + user.last.charAt(0)).toUpperCase();
  }

  async getEmail(): Promise<string> {
    const user = await this.getUser();
    return user.email;
  }

  async getAccess(): Promise<UserAccessType> {
    const user = await this.getUser();
    let access: UserAccessType = user.access;
    return access;
  }

  async getOranizarionAndRole(): Promise<string> {
    const user = await this.getUser();
    return (user.roleInOrganization + ", " + user.organization);
  }

  async getOranization(): Promise<string> {
    const user = await this.getUser();
    return user.organization;
  }

  async basicInformationExists(): Promise<boolean> {
    const user = await this.getUser();
    console.dir(user)
    return (
      (user.first != "") &&
      (user.last != "") &&
      (user.email != "") &&
      (user.organization != "")
    );
  }
  /**** **** ****/

  /**** Set ****/
  async setBasicUserInfo(firstName: string, lastName: string, email: string, organization: string): Promise<boolean> {
    const firstNameSuccess = await this.setFirstName(firstName);
    const lastNameSuccess = await this.setLastName(lastName);
    const emailSuccess = await this.setEmail(email);
    const organizationSuccess = await this.setOranization(organization);
    return (firstNameSuccess && lastNameSuccess && emailSuccess && organizationSuccess);
  }

  async setFirstName(value: string): Promise<boolean> {
    const capitalized =  value.charAt(0).toUpperCase() + value.slice(1)
    /* TODO: make api call instead */
    this.cookieService.set('firstName', capitalized);
    return (this.cookieService.get("firstName") ==  capitalized)
  }

  async setLastName(value: string): Promise<boolean> {
    const capitalized =  value.charAt(0).toUpperCase() + value.slice(1)
    /* TODO: make api call instead */
    this.cookieService.set('lastName', capitalized);
    console.log("last name set")
    return (this.cookieService.get("lastName") == capitalized)
  }

  async setEmail(value: string): Promise<boolean> {
    /* TODO: make api call instead */
    this.cookieService.set('email', value);
    return (this.cookieService.get("email") == value)
  }

  async setOranization(value: string): Promise<boolean> {
    /* TODO: make api call instead */
    this.cookieService.set('organization', value);
    return (this.cookieService.get("organization") == value)
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
    console.log("here =>  " + value)
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
  private createMockUser() {
    if (this.cookieService.get('email') != "") {
      return
    }
    this.setLastName("")
    this.setFirstName("Beth")
    this.setEmail("beth.bell@test.com")
    this.setOranization("Ministry of Tranaportation");
  }

  private getMockUser(): User {
    var user: User = {
      first: this.cookieService.get('firstName'),
      last: this.cookieService.get('lastName'),
      email: this.cookieService.get('email'),
      id: "666",
      access: UserAccessType.view,
      organization: this.cookieService.get('organization'),
      roleInOrganization: "Invasive Plant Specialist",
    };
    return user
  }
  /**** **** ****/

}