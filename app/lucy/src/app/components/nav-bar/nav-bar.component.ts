/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { AppRoutes, AppRoutesParams } from '../../constants/app-routes.enum';
import { StringConstants } from 'src/app/constants/string-constants';
import { SsoService } from '../../services/sso.service';
import { UserService } from '../../services/user.service';
import { RouterService } from '../../services/router.service';
import { Subscription } from 'rxjs';
import { UserAccessType } from 'src/app/models/Role';
import { RolesService } from 'src/app/services/roles.service';

declare const location: any;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Title of application to be displayed in header
   */
  public appTitle = ``;

  /**
   * User initials & full name
   */
  public userInitials = ``;
  public fullName = ``;

  /**
   * User access type
   */
  public accessType: UserAccessType = UserAccessType.DataViewer;

  /**
   * String representation of user's access (based on role)
   */
  public accessTypeMessage = ``;

    /**
   * Title of user's role within associated organization
   */
  public role = ``;    // TODO may need to be updated once Role implemented in API

  /**
   * Title of user's organization
   */
  public organization = ``;    // TODO may need to be updated once Organization implemented in API

  /**
   * Listener for route events
   */
  private routeEventsListener: Subscription;

  /**
   * Show/Hide nav bar actions
   */
  public get isAuthenticated(): boolean {
    return this.ssoService.isAuthenticated();
  }

  /**
   * Used for Highlighting element in
   * navigation bar when route is active
   */
  public get isAdminToolsActive(): boolean {
    return this.routerService.current === AppRoutes.AdminTools;
  }

  /**
   * Used for Highlighting element in
   * navigation bar when route is active
   */
  public get isAddEntryActive(): boolean {
    return this.routerService.current === AppRoutes.AddEntry;
  }

  /**
   * Used for Highlighting element in
   * navigation bar when route is active
   */
  public get isProfileActive(): boolean {
    return this.routerService.current === AppRoutes.Profile;
  }

  /**
  * Used for Highlighting element in
  * navigation bar when route is active
  */
  public get isInventoryActive(): boolean {
    return this.routerService.current === AppRoutes.Inventory;
  }

  /**
  * Used for Highlighting element in
  * navigation bar when route is active
  */
 public get isAboutActive(): boolean {
  return this.routerService.current === AppRoutes.About;
}
  /**
   * Used for displaying/hiding menu items in
   * navigation bar when Info route is active
   */
  public get isInfo(): boolean {
    return this.routerService.current === AppRoutes.UserInfo;
  }

  /**
   * Used for Highlighting element in
   * navigation bar when route is active
   */
  public get isAddObservationActive(): boolean {
    return this.routerService.current === AppRoutes.AddObservation;
  }

  /**
   * Show/Hide Add new observation button
   * This value will only change
   * when is called ngOnInit().
   * if you wish to manually refresh,
   * call this.setAccessType().
   */
  public get isDataEditor(): boolean {
    return this.roles.canCreate(this.accessType);
  }

  /**
   * Show/Hide Admin Tools Button.
   * This value will only change
   * when is called ngAfterViewInit().
   * if you wish to manually refresh,
   * call this.setAccessType().
   */
  public get isAdmin(): boolean {
    return (this.accessType === UserAccessType.Admin || this.accessType === UserAccessType.InspectAdmin);
  }

  /**
   * Show/Hide Add observation button
   * This value will only change
   * when is called ngAfterViewInit().
   * * If you wish to manually refresh,
   * call this.setAccessType().
   * * If you wish to refresh often:
   *  * add this.setAccessType() call
   *  * to this.listenForRouteChanges()
   */
  public get hasDataEntryAccess(): boolean {
    return (
      this.accessType === UserAccessType.Admin ||
      this.accessType === UserAccessType.DataEditor
    );
  }

  constructor(private routerService: RouterService, private ssoService: SsoService, private userService: UserService, private roles: RolesService) { }

  ngOnInit() {
    this.setAppTitle();
  }

  ngAfterViewInit() {
    this.setAppTitle();
    this.setInitials();
    this.setFullName();
    this.setAccessType();
    this.setOrganization();
    this.setRole();
    this.setAccessTypeMessage();
    this.listenForRouteChanges();
  }

  ngOnDestroy() {
    this.endRouteEventsListener();
  }

  /**
   * For refreshing navbar content that
   * may change based on user's
   * interactions with the app
   */
  private listenForRouteChanges() {
    this.routeEventsListener = this.routerService.events.subscribe((val) => {
      this.setInitials();
      this.setFullName();
      this.setAccessType();
      this.setAppTitle();
      this.setOrganization();
      this.setRole();
      this.setAccessTypeMessage();
    });
  }

  /**
   * Ending Listener in ngOnDestroy()
   */
  private endRouteEventsListener() {
    this.routeEventsListener.unsubscribe();
  }

  private setAppTitle() {
    this.appTitle = StringConstants.app_Title;
  }

  /**
   * Setting User's initials in
   * userInitials to be consumed by HTML
   */
  private async setInitials() {
    this.userInitials = await this.userService.getInitials();
  }

  /**
   * Setting User's full name
   * to be consumed by HTML
   */
  private async setFullName() {
    this.fullName = await this.userService.getFullName();
  }

  /**
   * Setting User's access type
   */
  private async setAccessType() {
    this.accessType = await this.userService.getAccess();
  }

  /**
   * Setting User's role (String value)
   * to be consumed by HTML
   */
  private async setRole() {
    this.role = await this.userService.getRole();
  }

  private async setOrganization() {
    this.organization = await this.userService.getOrganization();
  }
  
  private async setAccessTypeMessage() {

    this.userService.getAccess().then((value) => {
      this.accessType = value;
      switch (value) {
        case UserAccessType.DataEditor:
          this.accessTypeMessage = StringConstants.databaseAccess_DataEntry_Badge;
          break;
        case UserAccessType.Officer:
          // Fall though to give Officers the same permission as a Data viewer
        case UserAccessType.DataViewer:
          this.accessTypeMessage = StringConstants.databaseAccess_View_Badge;
          break;
        case UserAccessType.InspectAdmin:
          // Fall though to give Inspect Admin the same permission as an Admin
        case UserAccessType.Admin:
          this.accessTypeMessage = StringConstants.databaseAccess_Admin_Badge;
          break;
      }
    });
  }

  /**
   * SSO's logout function will
   * Remove cookies,
   * end refresh timer,
   * and end keycloak session
   * by redirecting to an external
   * and redirecting back.
   */
  logout() {
    this.ssoService.logout();
  }

  /**
   * Navigate to Profile Component
   */
  navigateToProfile() {
    this.routerService.navigateTo(AppRoutes.Profile, null, true);
  }

  /**
   * Navigate to About Component
   */
  navigateToAbout() {
    this.routerService.navigateTo(AppRoutes.About, null, true);
  }

  /**
   * Navigate to Admin Tools Component
   */
  navigateToAdminTools() {
    this.routerService.navigateTo(AppRoutes.AdminTools, null, true);
  }

  /**
   * Navigate to Add Observation Component
   */
  navigateToAddEntry() {
    this.routerService.navigateTo(AppRoutes.AddEntry, null, true);
  }

  /**
   * Navigate to Add Observation Component
   */
  navigateToAddObservation() {
    this.routerService.navigateTo(AppRoutes.AddObservation, null, true);
  }

  /**
   * Navigate to Inventory Component
   */
  navigateToInventory() {
    this.routerService.navigateTo(AppRoutes.Inventory, undefined, true);
  }
}
