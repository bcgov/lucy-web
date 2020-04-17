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
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AccessRequest, AccessRequestTableData } from 'src/app/models/AccessRequest';
import { Role } from 'src/app/models/Role';
import { User } from 'src/app/models';

@Component({
  selector: 'app-request-table',
  templateUrl: './request-table.component.html',
  styleUrls: ['./request-table.component.css']
})
export class RequestTableComponent implements OnInit, OnChanges {

  _currentUser: User;
  public _requests: AccessRequest[] = [];
  private _roles: Role[] = [];

  @Input() currentUser: User;
  @Input() isAdmin: boolean;

  public selectedRequest: AccessRequest;
  @Output() refreshList = new EventEmitter<any>();

  private requestDataSource: MatTableDataSource<AccessRequestTableData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public requestUsersColumns = ['username', 'name', 'roleRequested', 'reason', 'actions'];

  // get method for _requests
  get requests(): AccessRequest[] {
    return this._requests;
  }

  // set method for _requests
  @Input() set requests(allRequests: AccessRequest[]) {
    this._requests = allRequests;
  }

  // get method for _roles
  get roles(): Role[] {
    return this._roles;
  }

  // set method for _roles
  @Input() set roles(activeRoles: Role[]) {
    this._roles = activeRoles;
  }

  // check if the request table is empty or not
  get hasRequests(): boolean {
    return this.requests.length !== 0;
  }

  get showModal(): boolean {
    return this.selectedRequest !== undefined;
  }

  requestLength(): number {
    return this.requests.length;
  }

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
    this.initTable();
  }

  private initTable() {
    const reqUsers: AccessRequestTableData[] = [];
    if (this.requests.length === 0) return;

    this.requests.forEach(request => {
      const { requester, requestNote, request_id, requestedAccessCode } = request;
      if (!requester) return;

      const username = requester.preferredUsername;
      const name = requester.firstName + ' ' + requester.lastName; 
      const roleRequested = requestedAccessCode.role;

      reqUsers.push({
        username,
        name,
        roleRequested,
        reason: requestNote,
        request_id,
      });
    });

    this.requestDataSource = new MatTableDataSource<AccessRequestTableData>(reqUsers);
    this.requestDataSource.paginator = this.paginator;
  }

  disableRespond(user: User): boolean {
    if (!user || !this.currentUser) return false;

    return (this.currentUser.user_id === user.user_id);
  }

  public onRespondAction(item: AccessRequestTableData) {
    const { request_id } = item;
    if (!request_id) return;

    this.selectedRequest = this.requests.find(user => user.request_id === request_id);
  }

  public onModalClose(refresh: boolean) {
    this.selectedRequest = undefined;
    if (refresh) this.refreshList.emit();
  }

}
