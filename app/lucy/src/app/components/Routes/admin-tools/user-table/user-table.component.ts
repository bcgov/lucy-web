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
 * 	Created by Rajasekaran Manivannan on 2019-02-11.
 */
import { Component, OnInit, OnChanges, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatSelectChange, MatSlideToggleChange, MatTableDataSource, MatPaginator } from '@angular/material';
import { User, UserTableData } from 'src/app/models';
import { Role } from 'src/app/models/Role';
import { UserService } from 'src/app/services/user.service';
import { AdminService } from 'src/app/services/admin.service';
import { ToastService, ToastIconType } from 'src/app/services/toast/toast.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit, OnChanges {

  private _users: User[] = [];
  private _roles: Role[] = [];

  @Input() currentUser: User;
  @Input() isAdmin: boolean;

  selectedUser: User;
  @Output() fetchUsers = new EventEmitter<any>();

  private userDataSource: MatTableDataSource<UserTableData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public usersColumns = ['username', 'name', 'email', 'role', 'actions'];

  // get method for _users
  get users(): User[] {
    return this._users;
  }

  // set method for _users
  @Input() set users(allUsers: User[]) {
    this._users = allUsers;
  }

  // get method for _roles
  get roles(): Role[] {
    return this._roles;
  }

  // set method for _roles
  @Input() set roles(activeRoles: Role[]) {
    this._roles = activeRoles;
  }

  // check if the users table is empty or not
  get hasUsers(): boolean {
    return this.users.length !== 0;
  }

  // get the role of currently selected user
  get getUserRole(): string {
    if (!this.selectedUser) return '';
    return this.userService.getUserAccessCode(this.selectedUser).role;
  }

  // get the account active status
  get getUserStatus(): boolean {
    if (!this.selectedUser) return false;
    return this.selectedUser.accountStatus === 1;
  }

  disableEdit(user: User): boolean {
    if (!user || !this.currentUser) return false;

    return (this.currentUser.user_id === user.user_id);
  }

  showUserPopper(user: User): boolean {
    if (!user || !this.selectedUser) return false;
    return this.selectedUser.user_id === user.user_id;
  }
  
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private toastService: ToastService,
    private roleService: RolesService
  ) { }

  ngOnInit() { }

  ngOnChanges() {
    this.initTable();
  }

  private initTable() {
    const userTable: UserTableData[] = [];
    if (this.users.length === 0) return;

    this.users.forEach(user => {
      const { firstName, lastName, email, preferredUsername, user_id } = user;

      const username = preferredUsername;
      const name = firstName + ' ' + lastName;
      const roleData = this.userService.getUserAccessCode(user);
      const role = roleData ? roleData.role : '';

      userTable.push({
        username,
        name,
        email,
        role,
        user_id
      });
    });
    
    this.userDataSource = new MatTableDataSource<UserTableData>(userTable);
    this.userDataSource.paginator = this.paginator;
  }

  public changeUserRole(data: MatSelectChange) {
    const selectedRole = this.roles.find(activeRole => activeRole.role === data.value);
    this.adminService.changeUserRole(this.selectedUser, selectedRole).then(response => {
      if (response.success) {
        this.selectedUser = undefined;
        const updatedUser = response.response;
        this.fetchUsers.emit();
        this.toastService.show(`${updatedUser.preferredUsername}'s role change to ${selectedRole.role}.`, ToastIconType.success);
      } else {
        this.toastService.show('Failed, Could not change user role', ToastIconType.fail);
      }
    })
  }

  async changeUserStatus(toggle: MatSlideToggleChange) {
    const accountStatus = toggle.checked ? 1 : 0;
    this.adminService.changeUserAccountStatus(this.selectedUser, accountStatus, this.isAdmin).then(response => {
      if(response.success) {
        this.selectedUser = undefined;
        const updatedUser = response.response;
        this.fetchUsers.emit();
        this.toastService.show(`${updatedUser.preferredUsername}'s account status has been changed.`, ToastIconType.success);
      } else {
        this.toastService.show(`Failed, Could not change the status of ${this.selectedUser.firstName}'s account.`, ToastIconType.fail);
      }
    });
  }

  public onUserAction(item: UserTableData) {
    const { user_id } = item;
    if (!user_id) return;

    const selectedUser = this.users.find(user => user.user_id === user_id);
    this.selectedUser=selectedUser;
  }

  public onClickAway(): void {
    if (this.selectedUser) this.selectedUser = undefined;
  }

}
