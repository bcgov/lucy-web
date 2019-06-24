import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';
import { AdminService } from 'src/app/services/admin.service';
import { FormsModule } from '@angular/forms';
import { Role } from 'src/app/models/Role';

@Component({
  selector: 'tr[app-user-cell]',
  templateUrl: './user-cell.component.html',
  styleUrls: ['./user-cell.component.css']
})
export class UserCellComponent implements OnInit {

  public activeRoles: Role[] = []

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
    return this.user.email
  }

  get role(): string {
    return this.userService.getUserAccessCode(this.user).role;
  }

  get isActive(): boolean {
    return this.user.accountStatus === 1;
  }

  set isActive(isActive: boolean) {
    this.setUserStatus(isActive);
  }

  @Input() user: User = {
    accountStatus: 0,
    createdAt: "",
    currentSessionId: 0,
    email: "",
    firstName: "",
    lastName: "",
    preferredUsername: "",
    roles: [],
    updateAt: "",
    user_id: -1,
  }

  constructor(private roles: RolesService, private userService: UserService, private admin: AdminService, private formsModule: FormsModule) { }

  ngOnInit() {
    this.getAllRoles();
  }

  private getAllRoles()  {
    this.roles.getRoles().then((value) => {
      this.activeRoles = value;
    });
  }

  public removeUser(user: User) {
    console.log("******")
    console.log("TODO: Make api call to Remove User user:")
    console.log(user)
    console.log("******")
  }

  public setUserRole(role: Role) {
    this.admin.changeUserRole(this.user, role).then((response) => {
      if (response.success) {
        console.log("Role change success")
        this.user = response.response
        console.dir(response.response)
      } else {
        console.log("Role change failed")
      }
    })
  }

  private setUserStatus(active: boolean) {
    let newStatus = active ? 1 : 0
    console.log("SETTING STATUS TO " + newStatus)
    this.admin.changeUserAccountStatus(this.user, newStatus).then((response) => {
      if(response.success) {
        console.log("Status change success")
        this.user = response.response
        console.dir(response.response)
      } else {
        console.log("Status change failed")
      }
      console.log(this.user.accountStatus)
    });
  }

}
