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
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSelectChange } from '@angular/material';
import { RolesService } from 'src/app/services/roles.service';
import { AdminService } from 'src/app/services/admin.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';
import { ExportService, ExportType } from 'src/app/services/export/export.service';
import { AlertService } from 'src/app/services/alert.service';
import { AccessRequest, AccessRequestTableData } from 'src/app/models/AccessRequest';
import { User, UserTableData } from 'src/app/models';
import { Role } from 'src/app/models/Role';

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.css']
})

export class AdminToolsComponent implements OnInit, AfterViewInit {
  public requests: AccessRequest[] = [];
  public allUsers: User[] = [];
  public activeRoles: Role[] = [];
  public selectedUser: User;
  public selectedRequestUser: AccessRequest;

  public focusedAccessRequest: AccessRequest;

  public numberOfDataInInspectAppToExport: Number = 0;

  requestUsersColumns = ['username', 'name', 'roleRequested', 'reason', 'actions'];
  requestUsersDataSource: MatTableDataSource<AccessRequestTableData>;

  usersColumns = ['username', 'name', 'email', 'role', 'actions'];
  usersDataSource: MatTableDataSource<UserTableData>;

  get hasRequests(): boolean {
    return this.requests.length !== 0;
  }

  get hasUsers(): boolean {
    return this.allUsers.length !== 0;
  }

  get getUserRole(): string {
    if (!this.selectedUser) return '';
    return this.userService.getUserAccessCode(this.selectedUser).role;
  }

  showUserPopper(user: User): boolean {
    if (!user || !this.selectedUser) return false;
    return this.selectedUser.user_id === user.user_id;
  }

  onClickAway(): void {
    if (this.selectedUser) this.selectedUser = undefined;
  }

  constructor(
    private roles: RolesService,
    private admin: AdminService,
    private loadingService: LoadingService,
    private exportService: ExportService,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.fetchStaticData();
    this.fetchNonStaticData();
  }

  private fetchStaticData() {
    this.getAllRoles();
    this.getNumberOfDataInInspectAppToExport()
  }

  private fetchNonStaticData() {
    this.getAllUsers();
    this.getAllRequests();
  }

  private async getAllRequests() {
    this.loadingService.add();
    this.admin.getRequests().then(async (value) => {
      this.requests = value;
      await this.updateRequestUsersTable(value);
      this.loadingService.remove();
    });
  }

  private async updateRequestUsersTable(requests: AccessRequest[]) {
    const reqUsers: AccessRequestTableData[] = [];
    if (requests.length === 0) return;

    requests.forEach(request => {
      const { requester, requestNote } = request;
      if (!requester) return;

      const username = requester.preferredUsername;
      const name = requester.firstName + ' ' + requester.lastName; 
      const roleRequested = this.userService.getUserAccessCode(requester).role;

      reqUsers.push({
        username,
        name,
        roleRequested,
        reason: requestNote
      });
    });

    this.requestUsersDataSource = new MatTableDataSource<AccessRequestTableData>(reqUsers);
  }

  private async getAllUsers() {
    this.loadingService.add();
    this.admin.getAllUsers().then(async (value) => {
      this.allUsers = value;
      await this.updateUsersTable(value);
      this.loadingService.remove();
    });
  }

  private updateUsersTable(allUsers: User[]) {
    const users: UserTableData[] = [];
    if (allUsers.length === 0) return;

    allUsers.forEach(user => {
      const { firstName, lastName, email, preferredUsername, user_id } = user;

      const username = preferredUsername;
      const name = firstName + ' ' + lastName; 
      const role = this.userService.getUserAccessCode(user).role;

      users.push({
        username,
        name,
        email,
        role,
        user_id
      });
    });

    this.usersDataSource = new MatTableDataSource<UserTableData>(users);
  }

  private changeUserRole(data: MatSelectChange) {
    const selectedRole = this.activeRoles.find(activeRole => activeRole.role === data.value);
    this.admin.changeUserRole(this.selectedUser, selectedRole).then((response) => {
      if (response.success) {
        this.getAllUsers()
        this.alertService.show(`Success`,
         `${this.selectedUser.firstName}'s role change to ${selectedRole.role}.`, null);
      } else {
        this.alertService.show(`Failed`, `Could not change user role.`, null);
      }
    })
  }

  private async getNumberOfDataInInspectAppToExport() {
    this.exportService.getInspectAppExportData(ExportType.WatercraftRiskAssessment).then((data) => {
      if (data){
        this.numberOfDataInInspectAppToExport = data.length
      }
    });
  }

  private async getAllRoles() {
    this.loadingService.add();
    this.roles.getRoles().then((value) => {
      this.activeRoles = value;
      this.loadingService.remove();
    });
  }

  public requestResponseSent() {
    this.fetchNonStaticData();
  }

  public async export() {
    this.exportService.exportCSV(ExportType.WatercraftRiskAssessment);
  }

  public onUserAction(item: UserTableData) {
    const { user_id } = item;
    if (!user_id) return;

    const selectedUser = this.allUsers.find(user => user.user_id === user_id);
    this.selectedUser=selectedUser;
  }
}
