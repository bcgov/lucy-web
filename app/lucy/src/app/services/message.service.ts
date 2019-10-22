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

  private getDummyMessages(): Message[] {
    let messages: Message[] = [];
    messages.push({
      message_id: 1,
      title: `hello`,
      body: `world`,
      type: 0,
      status: 0
    });
    messages.push({
      message_id: 2,
      title: `hello 2`,
      body: `world 2`,
      type: 0,
      status: 0
    });
    messages.push({
      message_id: 3,
      title: `hello 3`,
      body: `world 3`,
      type: 0,
      status: 1
    });
    messages.push({
      message_id: 4,
      title: `hello 4`,
      body: `world 4`,
      type: 0,
      status: 0
    });
    messages.push({
      message_id: 5,
      title: `hello 5`,
      body: `world 5`,
      type: 0,
      status: 1
    });
    messages.push({
      message_id: 6,
      title: `hello 6`,
      body: `world 6`,
      type: 0,
      status: 0
    });

    return messages;
  }
}
