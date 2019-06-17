import { Component, OnInit, Input } from '@angular/core';
import { RolesService } from 'src/app/services/roles.service';
import { FormsModule }   from '@angular/forms';
import { accessRequest } from 'src/app/models/accessRequest';
import { Role } from 'src/app/models';

@Component({
  selector: 'app-access-request-response-modal',
  templateUrl: './access-request-response-modal.component.html',
  styleUrls: ['./access-request-response-modal.component.css']
})
export class AccessRequestResponseModalComponent implements OnInit {

  public activeRoles: Role[] = []

  @Input() accessRequest: accessRequest = {
    id: 0,
    username: "",
    name: "",
    currentRole: "",
    requestedRole: "",
    reasons: "",

    responseRole: "",
    responseMessage: "",
  }

  constructor(private roles: RolesService, private formsModule: FormsModule) { }

  ngOnInit() {
    this.roles.getRoles().then((value) => {
      this.activeRoles = value;
    });

    console.log("showing modal")
  }

  public sumbitRequestResponse() {
    console.log("TODO: Make API CALL TO SUBMIT REQUEST RESPONSE");
    console.log(this.accessRequest.responseRole);
  }

  public closeRequestResponse() {
    console.log("closing");
    this.accessRequest = {
      id: 0,
      username: "",
      name: "",
      currentRole: "",
      requestedRole: "",
      reasons: "",
  
      responseRole: "",
      responseMessage: "",
    }
  }

}
