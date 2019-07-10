import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Message } from 'src/app/models/Message';
import { MessageService } from 'src/app/services/message.service';
import * as bootstrap from 'bootstrap';
import * as $AB from 'jquery';
import {NgbModal, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-access-updated-modal',
  templateUrl: './user-access-updated-modal.component.html',
  styleUrls: ['./user-access-updated-modal.component.css']
})
export class UserAccessUpdatedModalComponent implements OnInit {

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

  constructor(private messageService: MessageService, private modalService: NgbModal) { }

  ngOnInit() {
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
