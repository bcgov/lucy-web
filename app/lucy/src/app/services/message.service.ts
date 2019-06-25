import { Injectable } from '@angular/core';
import { ApiService, APIRequestMethod, APIRequestResult } from './api.service';
import { ObjectValidatorService } from './object-validator.service';
import { Message } from '../models/Message';
import { AppConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private api: ApiService, private objectValidator: ObjectValidatorService) { }

  public async fetchMessages(): Promise<Message[]> {
    const response = await this.api.request(APIRequestMethod.GET, AppConstants.API_messages, null);
    return response.success ? response.response : [];


  }

  public async fetchUnreadMessages(): Promise<Message[]> {
    const messages = await this.fetchMessages();
    return messages.filter(this.isUnread);
  }

  private isUnread(message: Message, index: number, messages: Message[]) {
    return message.status === 0;
  }

  public async markAsRead(message: Message): Promise<boolean> {
    if (message === undefined || message === null) {
      return false;
    }
    message.status = 1;
    const response = await this.api.request(APIRequestMethod.PUT, AppConstants.API_updateUserMessage(message.message_id), message);
    return response.success;
  }

  private getDummyMessages() {
    // const msg: Message = {

    // }
  }
}
