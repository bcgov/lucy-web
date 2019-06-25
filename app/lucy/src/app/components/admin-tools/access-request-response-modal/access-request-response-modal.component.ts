import { Component, OnInit, Input, Output } from '@angular/core';
import { RolesService } from 'src/app/services/roles.service';
import { FormsModule } from '@angular/forms';
import { AccessRequest } from 'src/app/models/AccessRequest';
import { UserService } from 'src/app/services/user.service';
import { EventEmitter } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import * as bootstrap from 'bootstrap';
import * as $AB from 'jquery';
import { Role } from 'src/app/models/Role';

/**
 * Output of Access request modal
 *  * responsed:
 *    if a response has been sent and
 * the listener may want to refresh its content
 *  * cancelled:
 *    if canceleld, no action has been taken and
 * the listener may want to do something
 */
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
      return ``;
    } else {
      return (this.accessRequest.requester.firstName +
        ` ` + this.accessRequest.requester.lastName);
    }
  }

  get userRole(): string {
    if (this.accessRequest === undefined) {
      return ``;
    } else {
      return this.userService.getUserAccessCode(this.accessRequest.requester).role;
    }
  }

  get requestNote(): string {
    if (this.accessRequest === undefined) {
      return ``;
    } else {
      return this.accessRequest.requestNote;
    }
  }

  get requestedAccessCode(): string {
    if (this.accessRequest === undefined) {
      return ``;
    } else {
      return this.accessRequest.requestedAccessCode.role;
    }
  }

  set requestedAccessCode(name: string) {
    if (this.accessRequest === undefined) {
      return;
    }
    for (let role of this.activeRoles) {
      if (role.role == name) {
        this.accessRequest.requestedAccessCode = role
      }
    }
  }

  get approverNote() {
    if (this.accessRequest === undefined) {
      return ``;
    } else {
      return this.accessRequest.approverNote;
    }
  }

  set approverNote(note: string) {
    if (this.accessRequest === undefined) {
      return;
    }
    this.accessRequest.approverNote = note;
  }

  @Input() accessRequest: AccessRequest;
  @Output() acessRequestModalEmitter = new EventEmitter<AccessRequestResponseModalEmitterResponse>();

  constructor(private admin: AdminService ,private roles: RolesService, private formsModule: FormsModule, private userService: UserService) { }

  ngOnInit() {
    this.roles.getRoles().then((value) => {
      this.activeRoles = value;
    });
  }

  public sumbitRequestResponse() {
    this.admin.respondToRequest(this.accessRequest).then((success) => {
     if (success) {
      this.removeModal();
      this.acessRequestModalEmitter.emit(AccessRequestResponseModalEmitterResponse.responded);
     } else {
       // TODO: Handle with an alert or something
       console.log("Could not respond");
     }
    });
  }

  public cancelAction() {
    this.removeModal();
    this.acessRequestModalEmitter.emit(AccessRequestResponseModalEmitterResponse.cancelled);
  }

  private removeModal() {
    $('#requestResponseModal').modal('hide');
    $('.modal-backdrop').remove();
  }

}
