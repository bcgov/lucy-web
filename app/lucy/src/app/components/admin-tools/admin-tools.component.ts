import { Component, OnInit } from '@angular/core';
import { AccessRequest } from 'src/app/models/accessRequest';
import { usersList } from 'src/app/models/usersList';
import { RolesService } from 'src/app/services/roles.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminService } from 'src/app/services/admin.service';
import { User, Role } from 'src/app/models';
import { UserService } from 'src/app/services/user.service';

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

  private getAllRequests() {
    this.admin.getRequests().then((value) => {
      this.requests = value
    });
  }

  private getAllUsers() {
    this.admin.getAllUsers().then((value) => {
      this.allUsers = value
    });
  }

  private getAllRoles()  {
    this.roles.getRoles().then((value) => {
      this.activeRoles = value;
    });
  }

  public refreshRequests() {
    this.getAllRequests();
  }
}
