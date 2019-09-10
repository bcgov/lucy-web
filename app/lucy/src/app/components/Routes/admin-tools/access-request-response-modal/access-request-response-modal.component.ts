import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { RolesService } from 'src/app/services/roles.service';
import { FormsModule } from '@angular/forms';
import { AccessRequest } from 'src/app/models/AccessRequest';
import { UserService } from 'src/app/services/user.service';
import { EventEmitter } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import * as bootstrap from 'bootstrap';
import * as $AB from 'jquery';
import { Role } from 'src/app/models/Role';
import {NgbModal, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

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
    for (const role of this.activeRoles) {
      if (role.role === name) {
        this.accessRequest.requestedAccessCode = role;
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

  private modalReference: NgbModalRef;
  private _model: AccessRequest;

  get accessRequest(): AccessRequest {
    return this._model;
  }

  @Input() set accessRequest(model: AccessRequest) {
     this._model = model;
     this.delay(1).then(() => {
      this.showModal();
    });
  }

  @Output() acessRequestModalEmitter = new EventEmitter<AccessRequestResponseModalEmitterResponse>();
  @ViewChild('requestResponseModal') private content;

  constructor(private admin: AdminService, private roles: RolesService, private formsModule: FormsModule, private userService: UserService, private modalService: NgbModal) { }

  ngOnInit() {
    this.roles.getRoles().then((value) => {
      this.activeRoles = value;
    });
  }

  public sumbitRequestResponse() {
    this.admin.respondToRequest(this.accessRequest, true).then((success) => {
     if (success) {
      this.removeModal();
      this.acessRequestModalEmitter.emit(AccessRequestResponseModalEmitterResponse.responded);
     } else {
       // TODO: Handle with an alert or something
       console.log(`Could not respond`);
     }
    });
  }

  public cancelAction() {
    this.removeModal();
    this.acessRequestModalEmitter.emit(AccessRequestResponseModalEmitterResponse.cancelled);
  }

  private removeModal() {
    if (this.modalReference) {
      this.modalReference.close();
      this.modalReference = undefined;
    } else {
      console.log(`ERROR: Modal reference does not exist`);
    }
  }

  private async showModal() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'alertModalTitle'
    };

    if (!this.modalReference) {
      this.modalReference = this.modalService.open(this.content, ngbModalOptions);
    }
  }

  /**
   * Create a delay
   * @param ms milliseconds
   */
  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
