//
// Request Access and User Message Factory
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-06-3.
/**
 * Imports
 */
import * as faker from 'faker';
import { userFactory} from './userFactory';
import { RequestAccess, RequestAccessController, RoleCodeController, User, RolesCodeValue, UserMessageController, UserMessageStatus } from '../models';
import { UserMessage } from '../models';

/**
 * @description RequestAccess Factory method
 * @export const closure requestAccessFactory
 * @param User optional requesterIP
 * @param User optional approverIP
 * @return Promise<RequestAccess>
 */
export const requestAccessFactory = async (requesterIP?: User, approverIP?: User, noSave?: boolean): Promise<RequestAccess> => {
    const requester: User = requesterIP || await userFactory(RolesCodeValue.viewer, noSave);
    const approver: User = approverIP || await userFactory(RolesCodeValue.admin, noSave);
    const request: RequestAccess = RequestAccessController.shared.create();
    request.requestNote = faker.random.word();
    request.approverNote = faker.random.word();
    request.approver = approver;
    request.requester = requester;
    request.requestedAccessCode = await RoleCodeController.shared.getCode(RolesCodeValue.editor);
    request.status = 0;
    if (!noSave) {
        await RequestAccessController.shared.saveInDB(request);
    }
    return request;
};

/**
 * @description UserMessage Factory method
 * @export const closure userMessageFactory
 * @param User optional receiverIp
 * @param User optional creatorIp
 * @return Promise<UserMessage>
 */
export const userMessageFactory = async (receiverIp?: User, creatorIp?: User, noSave?: boolean): Promise<UserMessage> => {
    const receiver: User = receiverIp || await userFactory(RolesCodeValue.editor, noSave);
    const creator: User = creatorIp || await userFactory(RolesCodeValue.admin, noSave);
    const message: UserMessage = UserMessageController.shared.create();
    message.body = faker.random.word();
    message.title = faker.random.word();
    message.status = UserMessageStatus.unseen;
    message.type = 0;
    message.receiver = receiver;
    message.creator = creator;
    if (!noSave) {
        await UserMessageController.shared.saveInDB(message);
    }
    return message;
};

// -------------------------------------------------------------------------------
