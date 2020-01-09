/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Message } from 'src/app/models/Message';
import { MessageService } from 'src/app/services/message.service';
import * as bootstrap from 'bootstrap';
import * as $AB from 'jquery';
import {NgbModal, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { StringConstants } from 'src/app/constants/string-constants';
import { UserAccessType } from 'src/app/models/Role';

@Component({
  selector: 'app-user-access-updated-modal',
  templateUrl: './user-access-updated-modal.component.html',
  styleUrls: ['./user-access-updated-modal.component.css']
})
export class UserAccessUpdatedModalComponent implements OnInit, AfterViewInit {

  public userRoleAndOrganization = ``;
  public accessTypeMessage = ``;
  public userFullName = ``;
  public roleMessage = ``;

  get messageTitle(): string {
    if (this.message === undefined) {
      return ``;
    } else {
      return this.message.title;
    }
  }

  get messageBody(): string {
    if (this.message === undefined) {
      return ``;
    } else {
      return this.message.body;
    }
  }

  private modalReference: NgbModalRef;

  private _message: Message;

  get message(): Message {
    return this._message;
  }

  @Input()
  set message(model: Message) {
     this._message = model;
     this.delay(1).then(() => {
      this.showModal();
    });
  }

  @Output() userAccessUpdatedModalEventEmitter = new EventEmitter<boolean>();
  @ViewChild('userAccessMessageModal') private content;

  constructor(private messageService: MessageService, private modalService: NgbModal, private userService: UserService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.userService.getFullName().then((value) => {
      this.userFullName = value;
    });

    this.userService.getAccess().then((value) => {
      switch (value) {
        case UserAccessType.DataEditor:
          this.accessTypeMessage = StringConstants.databaseAccess_DataEntry_Badge;
          this.roleMessage = StringConstants.databaseAccess_DataEntry_Desc;
          break;
        case UserAccessType.DataViewer:
          this.accessTypeMessage = StringConstants.databaseAccess_View_Badge;
          this.roleMessage = StringConstants.databaseAccess_View_Desc;
          break;
        case UserAccessType.Admin:
          this.accessTypeMessage = StringConstants.databaseAccess_Admin_Badge;
          this.roleMessage = StringConstants.databaseAccess_Admin_Desc;
          break;
      }
    });

    this.userService.getOrganizationAndRole().then((value) => {
      this.userRoleAndOrganization = value;
    });
  }

  markAsRead() {
    this.messageService.markAsRead(this.message).then((success) => {
      if (success) {
        console.log(`Message Marked as read`);
        this.removeModal();
        this.userAccessUpdatedModalEventEmitter.emit(true);
      } else {
        console.log(`Message NOT Marked as read / FAILED`);
        this.removeModal();
        this.userAccessUpdatedModalEventEmitter.emit(true);
      }
    });
  }

  private removeModal() {
    if (this.modalReference) {
      this.modalReference.close();
      delete(this.modalReference)
      this.modalReference = undefined;
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
