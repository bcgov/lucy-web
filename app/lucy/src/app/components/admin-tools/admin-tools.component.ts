import { Component, OnInit } from '@angular/core';
import { AccessRequest } from 'src/app/models/AccessRequest';
import { RolesService } from 'src/app/services/roles.service';
import { AdminService } from 'src/app/services/admin.service';
import { User } from 'src/app/models';
import { Role } from 'src/app/models/Role';

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.css']
})

export class AdminToolsComponent implements OnInit {
  public requests: AccessRequest[] = []
  public allUsers: User[] = []
  public activeRoles: Role[] = []

  public focusedAccessRequest: AccessRequest;

  constructor(private roles: RolesService, private admin: AdminService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getAllRoles();
    this.getAllUsers();
    this.getAllRequests();
  }

  private async getAllRequests() {
    this.admin.getRequests().then((value) => {
      console.log("got requests")
      this.requests = value
      console.dir(value)
    });
  }

  private async getAllUsers() {
    this.admin.getAllUsers().then((value) => {
      this.allUsers = value
    });
  }

  private async getAllRoles()  {
    this.roles.getRoles().then((value) => {
      this.activeRoles = value;
    });
  }

  public refreshRequests() {
    console.log("refreshing");
    this.getAllRequests();
  }
}
