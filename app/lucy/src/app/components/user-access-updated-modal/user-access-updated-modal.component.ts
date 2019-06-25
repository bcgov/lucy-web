import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from 'src/app/models/Message';
import { MessageService } from 'src/app/services/message.service';
import * as bootstrap from 'bootstrap';
import * as $AB from 'jquery';

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

  constructor(private messageService: MessageService) { }

  @Input() message: Message;
  @Output() userAccessUpdatedModalEventEmitter = new EventEmitter<boolean>();

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
    $('#modal').modal('hide');
    $('.modal-backdrop').remove();
  }

}
