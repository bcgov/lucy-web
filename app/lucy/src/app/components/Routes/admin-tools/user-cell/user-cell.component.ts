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
import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';
import { AdminService } from 'src/app/services/admin.service';
import { Role, UserAccessType } from 'src/app/models/Role';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'tr[app-user-cell]',
  templateUrl: './user-cell.component.html',
  styleUrls: ['./user-cell.component.css']
})
export class UserCellComponent implements OnInit {

  /**
   * All currently active roles in the system
   */
  public activeRoles: Role[] = [];

  /**
   * Current user info
   */
  public currentUser: User = null;
  public currentAccessType: UserAccessType = UserAccessType.DataViewer;

  get username(): string {
    return this.user.preferredUsername;
  }

  get firstName(): string {
    return this.user.firstName;
  }

  get lastName(): string {
    return this.user.lastName;
  }

  get email(): string {
    return this.user.email;
  }

  get role(): string {
    if (this.userService.getUserAccessCode(this.user)) {
      return this.userService.getUserAccessCode(this.user).role;
    } else {
      return '';
    }
  }

  get isActive(): boolean {
    return this.user.accountStatus === 1;
  }

  set isActive(isActive: boolean) {
    this.setUserStatus(isActive);
  }

  get canEdit(): boolean {
    return this.canEditUser();
  }

  @Input() user: User = {
    accountStatus: 0,
    createdAt: ``,
    currentSessionId: 0,
    email: ``,
    firstName: ``,
    lastName: ``,
    preferredUsername: ``,
    roles: [],
    updateAt: ``,
    user_id: -1,
  }

  constructor(
    private roles: RolesService,
    private userService: UserService,
    private admin: AdminService,
    private loadingService: LoadingService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getAllRoles();
    this.getUserInfo();
  }

  /**
   * Get list of current active roles
   */
  private getAllRoles()  {
    this.roles.getRoles().then((value) => {
      this.activeRoles = value;
    });
  }

  /**
   * Get current user and their access type
   */
  private async getUserInfo() {
    this.loadingService.add();
    this.currentUser = await this.userService.getUser();
    this.currentAccessType = await this.userService.getAccess();
    this.loadingService.remove();
  }

  /**
   * Determine if the current user can edit the target user
   */
  public canEditUser() {
    if (!this.currentUser || !this.user) {
      return false;
    }
    return this.currentUser.user_id != this.user.user_id &&
      this.roles.canEditUser(this.currentAccessType, this.roles.roleToAccessType(this.userService.getUserAccessCode(this.user)));
  }

  public removeUser(user: User) {
    this.alertService.show(`Not implemented`,
         `Feature has not been implemented.`, null);
  }

  public setUserRole(role: Role) {
    this.admin.changeUserRole(this.user, role).then((response) => {
      if (response.success) {
        this.user = response.response;
        this.alertService.show(`Success`,
         `${this.user.firstName}'s role change to ${this.userService.getUserAccessCode(this.user).role}.`, null);
      } else {
        this.alertService.show(`Failed`, `Could not change user role.`, null);
      }
    })
  }

  private setUserStatus(active: boolean) {
    const newStatus = active ? 1 : 0
    this.admin.changeUserAccountStatus(this.user, newStatus).then((response) => {
      if(response.success) {
        this.user = response.response;
        this.alertService.show(`Success`,
         `${this.user.firstName}'s account status had been changed.`, null);
      } else {
        this.alertService.show(`Failed`, `Could not change the status of ${this.user.firstName}'s account.`, null);
      }
      console.log(this.user.accountStatus);
    });
  }

}
