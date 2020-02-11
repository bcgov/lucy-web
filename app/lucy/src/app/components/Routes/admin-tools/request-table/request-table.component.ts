import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AccessRequest, AccessRequestTableData } from 'src/app/models/AccessRequest';
import { Role } from 'src/app/models/Role';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-request-table',
  templateUrl: './request-table.component.html',
  styleUrls: ['./request-table.component.css']
})
export class RequestTableComponent implements OnInit, OnChanges {

  public _requests: AccessRequest[] = [];
  private _roles: Role[] = [];

  public selectedRequest: AccessRequest;
  @Output() fetchUsers = new EventEmitter<any>();

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

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.initTable();
  }

  private initTable() {
    const reqUsers: AccessRequestTableData[] = [];
    if (this.requests.length === 0) return;

    this.requests.forEach(request => {
      const { requester, requestNote, request_id } = request;
      if (!requester) return;

      const username = requester.preferredUsername;
      const name = requester.firstName + ' ' + requester.lastName; 
      const roleRequested = this.userService.getUserAccessCode(requester).role;

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

  public onRespondAction(item: AccessRequestTableData) {
    const { request_id } = item;
    if (!request_id) return;

    this.selectedRequest = this.requests.find(user => user.request_id === request_id);
  }

  public onBackdropClick(): void {
    this.selectedRequest = undefined;
  }

}
