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

  constructor(private roles: RolesService, private userService: UserService, private admin: AdminService, private formsModule: FormsModule) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.getAllRoles();

    this.getAllUsers();

    this.getAllRequests();
  }

  private getAllRequests() {
    this.admin.getRequests().then((value) => {
      console.log("got requests")
      console.dir(value)
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

  public setFocusedAccessRequest(request: AccessRequest) {
    this.focusedAccessRequest = request;
    console.log("request for modal set");
  }
  /*

  async getDummyRequests(): Promise<accessRequest[]> {
    const names = ["Mike Shasko", "Roop Jawl", "Pushan Mitra", "Kendall Olsen", "Jake Morris", "Amir Shayegh"]
    var requests: accessRequest[] = []
    const allroles = this.activeRoles;
    names.forEach((item, index) => {
      const randomInitialRole = Math.floor(Math.random() * 3) + 0
      var randomRequestedRole = Math.floor(Math.random() * 3) + 0
      while (randomRequestedRole == randomInitialRole) {
        randomRequestedRole = Math.floor(Math.random() * 3) + 0;
      }
      const currentRoleName = allroles.find(x => x.role_code_id === randomInitialRole).role;
      const requestedRoleName = allroles.find(x => x.role_code_id === randomRequestedRole).role;
      const request: accessRequest = {
        id: index,
        username: item.replace(/\s/g, "").toLowerCase(),
        name: item,
        currentRole: currentRoleName,
        requestedRole: requestedRoleName,
        reasons: "My reasons and stuff for " + item,

        responseRole: requestedRoleName,
        responseMessage: ""
      }
      requests.push(request)
    });
    return requests;
  }

  async getDummyUserslist(): Promise<usersList[]> {
    var usersList: usersList[] = []
    let requests = await this.getDummyRequests()
    requests.forEach((item, index) => {
      const userListItem: usersList = {
        id: item.id,
        username: item.username,
        firstName: item.name.split(" ")[0],
        lastName: item.name.split(" ")[1],
        email: item.username + "@gov.bc.ca",
        role: item.currentRole,
        isActive: true,
      }
      usersList.push(userListItem);
    });
    return usersList
  }*/
}
