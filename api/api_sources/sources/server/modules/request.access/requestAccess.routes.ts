//
// Request-access route controller
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
// Created by Pushan Mitra on 2019-06-10.
/**
 * Imports
 */
import * as assert from 'assert';
import { Request, Router, Response} from 'express';
import {
    Get,
    ResourceRoute,
    RouteController,
    Put,
    idValidator,
    inspectAppAdminRoute,
    Post,
    ValidatorExists
} from '../../core';
import { UserDataController, RequestAccessController, User, RequestStatus, RequestAccess, RolesCodeValue } from '../../../database/models';
import {
    UserMessage,
    UserMessageController,
    RolesCode,
    RoleCodeController
} from '../../../database/models';
import { check, sanitize, sanitizeBody } from 'express-validator';
import { BaseLogger, LogProvider } from '../../../libs/utilities';

/**
 * @description Create request body structure
 */
interface CreateRequestAccess {
    requestedAccessCode: RolesCode;
    requestNote: string;
}

/**
 * @description Checking Valid approver or not
 * @param Express.request req
 * @param Express.resp resp
 * @param Express.next next
 */
const checkApprover = (provider: LogProvider) => (req: any, resp: Response, next: any) => {
    assert(req.id, 'No Access request object in api req. It must be handled by validator');
    assert(req.user, 'No user for request');
    const user = req.user as User;
    const accessRequest: RequestAccess = req.id as RequestAccess;
    // Check request access is for proper admin or not
    if (user.isInspectAppAdmin && accessRequest.requestedAccessCode.roleCode !== RolesCodeValue.inspectAppOfficer) {
        const logger: BaseLogger = provider();
        logger.error(`checkApprover: Un-authorize update request from ${user.email} {inspect app admin}`);
        resp.status(401).json({
            message: `Un-authorize update request from ${user.email} {inspect app admin}`,
            time: `${Date()}`,
            errors: []
        });
        return;
    }
    next();
    return;
};

/**
 * @description Request access route controller
 */
@ResourceRoute({
    dataController: RequestAccessController.shared,
    secure: true
})
class RequestAccessRouteController extends RouteController {
    userController: UserDataController = UserDataController.shared;

    static get shared(): RequestAccessRouteController {
        return this.sharedInstance() as RequestAccessRouteController;
    }

    constructor() {
        super();
    }

    /**
     * Route's Handler
     */

    /**
     * @description Handling request access route
     * @param Request req
     */
    @Get({
        path: '/',
        description: 'Index route for request access'
    })
    public async index(req: Request) {
        const user: User = req.user as User;
        assert(req.user, 'No user for request');
        if (user.isAdmin || user.isInspectAppAdmin) {
            this.logger.info(`index | send all request access to user ${req.user.email} (admin)`);
            let data: RequestAccess[] = await this.dataController.all({
                status: 0
            });
            if (user.isInspectAppAdmin) {
                // Filtering data for inspect app officer request access
                data = data.filter( (item: RequestAccess) => item.requestedAccessCode.roleCode === RolesCodeValue.inspectAppOfficer);
            }
            return [200, data];
        } else {
            const allPendingRequests: RequestAccess[] = await this.dataController.all({
                status: 0,
                requester: req.user,
            });
            const latestRequest = await UserDataController.shared.latestAccessRequest(user);
            const pendingStatus = await UserDataController.shared.getPendingStatus(allPendingRequests);

            this.logger.info(`index | send own request access to user ${req.user.email} (user)`);
            return [200, { ...pendingStatus, latestRequest }];
        }
    }

    @Put({
        path: '/:id',
        middleware: () => [
            idValidator('id', RequestAccessController.shared, async () => {}),
            ValidatorExists({
                requestedAccessCode: RoleCodeController.shared,
            }),
            check('status').isInt().custom(async (val: number) => {
                assert(val >= 0 && val < 3, 'requestAccess: update: invalid status');
            }),
            check('approverNote').isString(),
            sanitizeBody('approverNote'),
            inspectAppAdminRoute(),
            checkApprover(() => RequestAccessRouteController.shared.logger)
        ]
    })
    public async update(req: any) {
        assert(req.id, 'No Access request object in api req. It must be handled by validator');
        assert(req.user, 'No user for request');
        let accessRequest: RequestAccess = req.id as RequestAccess;
        // Get approver
        accessRequest.approverNote = req.body.approverNote || accessRequest.approverNote;
        accessRequest.requestNote = req.body.requestNote || accessRequest.requestNote;
        // Check change in access request requested role
        if (req.body.requestedAccessCode.role_code_id !== accessRequest.requestedAccessCode.role_code_id) {
            this.logger.info(`Update change in requested access code for req id ${accessRequest.request_id} new access code: ${req.body.requestedAccessCode}`);
            accessRequest.requestedAccessCode = req.body.requestedAccessCode;
        }
        // Check status
        if (req.body.status && req.body.status !== accessRequest.status) {
            accessRequest = await this.handleStatusUpdate(req.body.status, accessRequest, req.user);
        }

        await this.dataController.saveInDB(accessRequest);

        return [200, accessRequest];
    }

    @Post({
        path: '/',
        middleware: () => [
            ValidatorExists({
                requestedAccessCode: RoleCodeController.shared
            }),
            check('requestNote').isString(),
            sanitize('requestNote')
        ]
    })
    public async create(req: any) {
        const input = req.body as CreateRequestAccess;
        const requestedRole = input.requestedAccessCode;
        const currentRoles: RolesCode[] = req.user.roles;

        const isExistingRole = currentRoles.find(role => role.role_code_id === requestedRole.role_code_id);

        if (isExistingRole) {
            return [208, { ...input, message: `You already have ${requestedRole.role} access` }];
        }

        const hasPendingAccessRequest = await this.dataController.fetchOne({
            requester: req.user,
            requestedAccessCode: requestedRole,
            status: 0
        });

        if (hasPendingAccessRequest) {
            return [208, { ...input, message: 'A valid pending request exists already' }];
        }

        const requestAccess: RequestAccess = this.dataController.create();
        requestAccess.requestNote = input.requestNote;
        requestAccess.requestedAccessCode = input.requestedAccessCode;
        requestAccess.requester = req.user;
        requestAccess.status = 0;

        // Save
        await this.dataController.saveInDB(requestAccess);
        assert(requestAccess.request_id, 'No request id created');
        return [201, requestAccess];
    }



    /**
     * Helpers
     */
    /**
     * Handling status update of request-access
     * @param number status
     * @param RequestAccess requestAccess
     * @param User approver
     * @return Promise<RequestAccess>
     */
    async handleStatusUpdate(status: number, requestAccess: RequestAccess, approver: User): Promise<RequestAccess> {
        requestAccess.status = status;
        requestAccess.approver = approver;

        // Get Requester
        const requester: User = requestAccess.requester;
        // Create Message
        const message: UserMessage = UserMessageController.shared.create();
        if (status === RequestStatus.approved) {
            this.logger.info(`Access request ${requestAccess.request_id} is approved by ${requestAccess.approver.email}`);
            message.title = 'Request Access approved';
            // Update requester
            requester.roles = [requestAccess.requestedAccessCode];
            await this.userController.saveInDB(requester);
        } else if (status === RequestStatus.rejected) {
            this.logger.info(`Access request ${requestAccess.request_id} is rejected by ${requestAccess.approver.email}`);
            message.title = 'Request Access rejected';
        } else {
            this.logger.info(`Unhandled status update: ${JSON.stringify(requestAccess)}`);
        }
        message.receiver = requestAccess.requester;
        message.creator = requestAccess.approver;
        message.body = requestAccess.approverNote;
        message.type = 0;
        message.status = 0;

        // Save Message
        await UserMessageController.shared.saveInDB(message);
        return requestAccess;
    }


}

/**
 * @description Function to return Request access route handle
 * @export const requestAccessRoutes
 */
export const requestAccessRoutes = (): Router => {
    const controller = RequestAccessRouteController.shared;
    return controller.router;
};

// -----------------------------------------------------------------------------------------------------------
