import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccessRequest } from 'src/app/models/AccessRequest';
import { UserService } from 'src/app/services/user.service';
import { AccessRequestResponseModalEmitterResponse } from '../access-request-response-modal/access-request-response-modal.component';

@Component({
  selector: 'tr[app-request-cell]',
  templateUrl: './request-cell.component.html',
  styleUrls: ['./request-cell.component.css']
})
export class RequestCellComponent implements OnInit {

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
  @Output() shouldRefresh = new EventEmitter();

  constructor(private userService: UserService) { }

  ngOnInit() {}

  /**
   * Listen for changes emitted by request modal.
   * responding flag is used to add or remove 
   * the modal component.
   * If the even requires a refresh of content,
   * Emits an event via shouldRefresh
   * @param event AccessRequestResponseModalEmitterResponse
   */
  acessRequestModalEmitted(event: AccessRequestResponseModalEmitterResponse) {
    console.log("Event heard");
    switch(event) {
      case AccessRequestResponseModalEmitterResponse.responded:
          this.responding = false
          this.shouldRefresh.emit();
        break;
      case AccessRequestResponseModalEmitterResponse.cancelled:
        this.responding = false
        break;
    }
  }

  
}
