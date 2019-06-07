// Request Acess Factory
import * as faker from 'faker';

import { userFactory} from './userFactory'
import { RequestAccess, RequestAccessController, LoginAccessCodeController, User, RolesCodeValue } from '../models'


export const requestAccessFactory = async (requesterIP?: User, approverIP?: User): Promise<RequestAccess> => {
    const requester: User = requesterIP || await userFactory(RolesCodeValue.viewer);
    const approver: User = approverIP || await userFactory(RolesCodeValue.admin);

    const request: RequestAccess = RequestAccessController.shared.create();
    request.requestNote = faker.random.word()
    request.approverNote = faker.random.word()
    request.approver = approver;
    request.requester = requester;
    request.requestedAccessCode = await LoginAccessCodeController.shared.getCode(RolesCodeValue.editor);

    return request;
};