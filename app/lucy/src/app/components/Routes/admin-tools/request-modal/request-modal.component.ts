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
 * 	Created by Rajasekaran Manivannan on 2019-02-12.
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { AccessRequest } from 'src/app/models/AccessRequest';
import { UserService } from 'src/app/services/user.service';
import { FormMode } from 'src/app/models';
import { Role } from 'src/app/models/Role';
import { AdminService } from 'src/app/services/admin.service';
import { ToastIconType, ToastService } from 'src/app/services/toast/toast.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-request-modal',
  templateUrl: './request-modal.component.html',
  styleUrls: ['./request-modal.component.css']
})
export class RequestModalComponent implements OnInit {

  private _roles: Role[] = [];
  private _request: AccessRequest;
  private _mode: FormMode = FormMode.Edit;
  private _selectedRole: Role;
  
  @Input() isAdmin: boolean;

  @Output() onModalClose = new EventEmitter<any>();

  get mode(): FormMode {
    return this._mode;
  }

  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }

  // get method for _roles
  get roles(): Role[] {
    return this._roles;
  }

  // set method for _roles
  @Input() set roles(activeRoles: Role[]) {
    this._roles = activeRoles;
  }

  get request(): AccessRequest {
    return this._request;
  }

  @Input() set request(selectedRequest: AccessRequest) {
    this._request = selectedRequest;
    this.selectedRole = selectedRequest.requestedAccessCode.role;
  }

  get approverNote() {
    if (this.request === undefined) return ``;

    return this.request.approverNote;

  }

  set approverNote(note: string) {
    if (this.request === undefined) return;

    this.request.approverNote = note;
  }

  get selectedRole(): string {
    if (!this.request) return '';
    return this._selectedRole.role;
  }

  set selectedRole(role: string) {
    if (!this.request || !role) return;
    this._selectedRole = this.roles.find(activeRole => activeRole.role === role);
  }

  // get the account active status
  get userStatus(): boolean {
    if (!this.request) return false;
    return this.request.requester.accountStatus === 1;
  }

  get roleToDisplay(): string {
    if (!this.request) return '';

    if (this.request.requester.accountStatus === 0 && this.isAdmin) {
      return this.getRole(2).role;
    }

    return this.selectedRole
  }

  getCurrentRole(): string {
    if (!this.request) return '';
    return this.userService.getUserAccessCode(this.request.requester).role;
  }

  getRole(roleId: number): Role {
    const selected = this.roles.find(role => role.role_code_id === roleId);
    return selected;
  }

  userInfo(info: string): string {
    if (!this.request || !info) return '';

    return {
      firstName: this.request.requester.firstName,
      lastName: this.request.requester.lastName,
      role: this.request.requestedAccessCode.role,
      requestNote: this.request.requestNote
    }[info];
  }

  get canEdit(): boolean {
    return (this.request.requester.accountStatus === 0 || !this.isAdmin);
  }

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private roleService: RolesService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    
  }
  

  onCancel() {
    this.onModalClose.emit(false);
  }

  public changeUserStatus(toggle: MatSlideToggleChange) {
    const accountStatus = toggle.checked ? 1 : 0;
    // If the account status is inactive, change the role to data viewer
    if (accountStatus === 0) {
      const selected = this.getRole(2);
      this.request.requester.roles = [selected];
    }

    this.request.requester.accountStatus = accountStatus;
  }

  public async updateAccess() {
    const { requester } = this.request;
    const selected = this.roles.find(item => item.role === this.selectedRole);
    try {
      if (requester.accountStatus === 0) {
        await this.adminService.changeUserAccountStatus(requester, requester.accountStatus, this.isAdmin);
      }
      this.request.requester.roles = [selected];
      const status = await this.adminService.respondToRequest(this.request, true);
      if (!status) throw new Error();
      this.onModalClose.emit(true);
      this.toastService.show(`${this.request.requester.preferredUsername}'s request has been updated.`, ToastIconType.success);
    } catch (error) {
      this.onModalClose.emit(true);
      this.toastService.show(`${this.request.requester.preferredUsername}'s request could not be updated.`, ToastIconType.fail);
    }
  }

}
