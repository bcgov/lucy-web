import { Component, OnInit, Input, Output } from '@angular/core';
import { RolesService } from 'src/app/services/roles.service';
import { FormsModule }   from '@angular/forms';
import { AccessRequest } from 'src/app/models/accessRequest';
import { Role } from 'src/app/models';
import { UserService } from 'src/app/services/user.service';
import { EventEmitter } from '@angular/core';

export enum AccessRequestResponseModalEmitterResponse {
  responded,
  cancelled,
}

@Component({
  selector: 'app-access-request-response-modal',
  templateUrl: './access-request-response-modal.component.html',
  styleUrls: ['./access-request-response-modal.component.css']
})
export class AccessRequestResponseModalComponent implements OnInit {

  public activeRoles: Role[] = [];

  get userName(): string {
    if (this.accessRequest === undefined) {
      return "";
    } else {
      return (this.accessRequest.requester.firstName + 
        " " + this.accessRequest.requester.lastName);
    }
  }

  get userRole(): string {
    if (this.accessRequest === undefined) {
      return "";
    } else {
      return this.userService.getUserAccessCode(this.accessRequest.requester).role;
    }
  }

  get requestNote(): string {
    if (this.accessRequest === undefined) {
      return "";
    } else {
      return this.accessRequest.requestNote;
    }
  }

  get requestedAccessCode(): string {
    if (this.accessRequest === undefined) {
      return "";
    } else {
      return this.accessRequest.requestedAccessCode.role;
    }
  }

  set requestedAccessCode(name: string) {
    if (this.accessRequest === undefined) {
      return
    }
    for (let role of this.activeRoles) {
      if (role.role == name) {
        this.accessRequest.requestedAccessCode = role
      }
    }
  }

  @Input() accessRequest: AccessRequest;
  @Output() acessRequestModalEmitter = new EventEmitter<AccessRequestResponseModalEmitterResponse>();

  constructor(private roles: RolesService, private formsModule: FormsModule, private userService: UserService) { }

  ngOnInit() {
    this.roles.getRoles().then((value) => {
      this.activeRoles = value;
    });
  }

  public sumbitRequestResponse() {
    console.log("TODO: Make API CALL TO SUBMIT REQUEST RESPONSE");
    console.dir(this.accessRequest)
    this.acessRequestModalEmitter.emit(AccessRequestResponseModalEmitterResponse.responded);
  }

  public cancelAction() {
    console.log("cancel action")
    this.acessRequestModalEmitter.emit(AccessRequestResponseModalEmitterResponse.cancelled);
  }

}
