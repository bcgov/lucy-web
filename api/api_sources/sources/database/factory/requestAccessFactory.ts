/**
 * Request Access and User Message Factory
 */
import * as faker from 'faker';

import { userFactory} from './userFactory';
import { RequestAccess, RequestAccessController, RoleCodeController, User, RolesCodeValue, UserMessageController } from '../models';
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
    message.status = 0;
    message.type = 0;
    message.receiver = receiver;
    message.creator = creator;
    if (!noSave) {
        await UserMessageController.shared.saveInDB(message);
    }
    return message;
};

// -------------------------------------------------------------------------------
