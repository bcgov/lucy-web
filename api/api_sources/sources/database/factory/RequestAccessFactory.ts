// Request Acess Factory
import * as faker from 'faker';

import { userFactory} from './userFactory';
import { RequestAccess, RequestAccessController, RoleCodeController, User, RolesCodeValue, UserMessageController } from '../models';
import { UserMessage } from '../models';


export const requestAccessFactory = async (requesterIP?: User, approverIP?: User): Promise<RequestAccess> => {
    const requester: User = requesterIP || await userFactory(RolesCodeValue.viewer);
    const approver: User = approverIP || await userFactory(RolesCodeValue.admin);

    const request: RequestAccess = RequestAccessController.shared.create();
    request.requestNote = faker.random.word();
    request.approverNote = faker.random.word();
    request.approver = approver;
    request.requester = requester;
    request.requestedAccessCode = await RoleCodeController.shared.getCode(RolesCodeValue.editor);

    return request;
};

export const userMessageFactory = async (receiverIp?: User, creatorIp?: User): Promise<UserMessage> => {
    const receiver: User = receiverIp || await userFactory(RolesCodeValue.editor);
    const creator: User = creatorIp || await userFactory(RolesCodeValue.admin);

    const message: UserMessage = UserMessageController.shared.create();
    message.body = faker.random.word();
    message.title = faker.random.word();
    message.status = 0;
    message.type = 0;
    message.receiver = receiver;
    message.creator = creator;

    return message;
};

