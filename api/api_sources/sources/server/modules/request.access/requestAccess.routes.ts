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
import { Request, Response, Router} from 'express';
import { RouteHandler, SecureRouteController, adminOnlyRoute } from '../../core';
import { UserDataController, RequestAccessController, User, RequestStatus, RequestAccess } from '../../../database/models';
import { UserMessage, UserMessageController, RolesCode, RoleCodeController} from '../../../database/models';

/**
 * @description Create request body structure
 */
interface CreateRequestAccess {
    requestedAccessCode: number;
    requestNote: string;
}

/**
 * @description Request access route controller
 */
class RequestAccessRouteController extends SecureRouteController<RequestAccessController> {
    userController: UserDataController = UserDataController.shared;
    constructor() {
        super();
        this.dataController = RequestAccessController.shared;

        // Configure route
        // Index for all request-access
        this.router.get('/', this.index);

        // Update request-access
        this.router.put('/:requestId', [adminOnlyRoute()], this.update);

        // Create
        this.router.post('/', this.create);
    }

    /**
     * Route's Handler
     */

    /**
     * Handling index route
     * @return RouteHandler
     */
    get index(): RouteHandler {
        return async (req: Request, resp: Response) => {
            try {
                // Now fetch all request access and send it
                assert(req.user, 'No user for request');
                const user: User = req.user as User;
                if (user.isAdmin) {
                    this.logger.info(`index | send all request access to user ${req.user.email} (admin)`);
                    return resp.status(200).json(this.successResp(await this.dataController.all({
                        status: 0
                    })));
                } else {
                    this.logger.info(`index | send own request access to user ${req.user.email} (admin)`);
                    return resp.status(200).json(this.successResp(await user.requestAccess || null));
                }
            } catch (excp) {
                this.commonError(500, 'index', excp, resp);
                return;
            }
        };
    }

    /**
     * Update Request Access
     * @return RouteHandler
     */
    get update(): RouteHandler {
        return async (req: Request, resp: Response) => {
            try {
                assert(req.params.requestId, 'No requestId in params. It must be handled by validator');
                assert(req.user, 'No user for request');
                // Getting request
                let accessRequest = await this.dataController.findById(req.params.requestId);
                assert(accessRequest, 'No access request found, should be handle by middleware');
                // Get approver
                accessRequest.approverNote = req.body.approverNote || accessRequest.approverNote;
                accessRequest.requestNote = req.body.requestNote || accessRequest.requestNote;
                // Check change in access request requested role
                if (req.body.requestedAccessCode !== accessRequest.requestedAccessCode.role_code_id) {
                    this.logger.info(`Update change in requested access code for req id ${accessRequest.request_id} new access code: ${req.body.requestedAccessCode}`);
                    accessRequest.requestedAccessCode = await RoleCodeController.shared.findById(req.body.requestedAccessCode);
                }
                // Check status
                let requireDel = false;
                if (req.body.status && req.body.status !== accessRequest.status) {
                    [accessRequest, requireDel] = await this.handleStatusUpdate(req.body.status, accessRequest, req.user);
                }
                // Save or delete
                if (requireDel) {
                    await this.dataController.remove(accessRequest);
                } else {
                    await this.dataController.saveInDB(accessRequest);
                }
                // Send Response
                resp.status(200).json(this.successResp(accessRequest));
            } catch (excp) {
                this.commonError(500, 'update', excp, resp);
                return;
            }
        };
    }

    /**
     * @description Create new request access for user
     * @return RouteHandler
     */
    get create(): RouteHandler {
        return async (req: Request, resp: Response) => {
            try {
                assert(req.user, 'No User of the request');

                // Checking request is exists or not
                const user: User = req.user as User;
                const existing = await user.requestAccess;
                if (existing) {
                    this.logger.info(`Request Access Exists for user: ${user.email}`);
                    resp.status(200).json(this.successResp(existing));
                    return;
                }

                const input = req.body as CreateRequestAccess;
                assert(input, 'No input to create access');
                const requestAccess: RequestAccess = this.dataController.create();
                requestAccess.requestNote = input.requestNote;
                // Get access code
                const accessCode: RolesCode = await RoleCodeController.shared.findById(input.requestedAccessCode);
                assert(accessCode, 'Access code not found, should be handle by validator');
                requestAccess.requestedAccessCode = accessCode;
                requestAccess.requester = req.user;
                requestAccess.status = 0;

                // Save
                await this.dataController.saveInDB(requestAccess);
                assert(requestAccess.request_id, 'No request id created');

                // Send new object
                resp.status(201).json(this.successResp(requestAccess));
            } catch (excp) {
                this.commonError(500, 'update', excp, resp);
                return;
            }
        };
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
    async handleStatusUpdate(status: number, requestAccess: RequestAccess, approver: User): Promise<[RequestAccess, boolean]> {
        requestAccess.status = status;
        requestAccess.approver = approver;

        // Get Requester
        const requester: User = requestAccess.requester;
        // Create Message
        const message: UserMessage = UserMessageController.shared.create();
        let delObj = false;
        if (status === RequestStatus.approved) {
            this.logger.info(`Access request ${requestAccess.request_id} is approved by ${requestAccess.approver.email}`);
            message.title = 'Request Access approved';
            // Update requester
            requester.roles = [requestAccess.requestedAccessCode];
            await this.userController.saveInDB(requester);
            delObj = true;
        } else if (status === RequestStatus.rejected) {
            this.logger.info(`Access request ${requestAccess.request_id} is rejected by ${requestAccess.approver.email}`);
            message.title = 'Request Access rejected';
            delObj = true;
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
        return [requestAccess, delObj];
    }


}

/**
 * @description Function to return Request access route handle
 * @export const requestAccessRoutes
 */
export const requestAccessRoutes = (): Router => {
    const controller = new RequestAccessRouteController();
    return controller.router;
};

// -----------------------------------------------------------------------------------------------------------
