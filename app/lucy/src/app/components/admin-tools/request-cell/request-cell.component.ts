import { Component, OnInit, Input } from '@angular/core';
import { AccessRequest } from 'src/app/models/accessRequest';
import { UserService } from 'src/app/services/user.service';
import { AccessRequestResponseModalEmitterResponse } from '../../access-request-response-modal/access-request-response-modal.component';

@Component({
  selector: 'tr[app-request-cell]',
  templateUrl: './request-cell.component.html',
  styleUrls: ['./request-cell.component.css']
})
export class RequestCellComponent implements OnInit {

  constructor(private userService: UserService) { }

  responding: boolean = false

  get userUserame(): string {
    if (this.request === undefined) {
      return "";
    } else {
      return this.request.requester.preferredUsername;
    }
  }

  get userName(): string {
    if (this.request === undefined) {
      return "";
    } else {
      return (this.request.requester.firstName + 
        " " + this.request.requester.lastName);
    }
  }

  get userRole(): string {
    if (this.request === undefined) {
      return "";
    } else {
      return this.userService.getUserAccessCode(this.request.requester).role;
    }
  }

  get requestNote(): string {
    if (this.request === undefined) {
      return "";
    } else {
      return this.request.requestNote;
    }
  }

  get requestedAccessCode(): string {
    if (this.request === undefined) {
      return "";
    } else {
      return this.request.requestedAccessCode.role;
    }
  }

  @Input() request: AccessRequest;

  ngOnInit() {
  }

  acessRequestModalEmitted(event: AccessRequestResponseModalEmitterResponse) {
    console.log("Event heard");
    switch(event) {
      case AccessRequestResponseModalEmitterResponse.responded:
          console.log("responded");
        this.responding = false
        break;
      case AccessRequestResponseModalEmitterResponse.cancelled:
          console.log("cancelled");
        this.responding = false
        break;
    }
  }
}
