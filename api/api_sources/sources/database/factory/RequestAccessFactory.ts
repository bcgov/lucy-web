// Request Acess Factory
import * as faker from 'faker';

import { userFactory} from './UserFactory'
import { RequestAccess, RequestAccessController, LoginAccessCodeController, User, LoginAccessCodeValue } from '../models'


export const requestAccessFactory = async (requesterIP?: User, approverIP?: User): Promise<RequestAccess> => {
    const requester: User = requesterIP || await userFactory(LoginAccessCodeValue.viewer);
    const approver: User = approverIP || await userFactory(LoginAccessCodeValue.admin);

    const request: RequestAccess = RequestAccessController.shared.create();
    request.requestNote = faker.random.word()
    request.approverNote = faker.random.word()
    request.approver = approver;
    request.requester = requester;
    request.requestedAccessCode = await LoginAccessCodeController.shared.getCode(LoginAccessCodeValue.editor);

    return request;
};