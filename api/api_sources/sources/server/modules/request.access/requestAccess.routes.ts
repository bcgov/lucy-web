/**
 * Admin Routs
 */
import * as assert from 'assert';
import { Request, Response, Router} from 'express';
import { RouteHandler, SecureRouteController, adminOnlyMiddleware } from '../../core';
import { UserDataController, RequestAccessController, User, RequestStatus, RequestAccess } from '../../../database/models';
import { UserMessage, UserMessageController, RolesCode, RoleCodeController} from '../../../database/models';

interface CreateRequestAccess {
    requestedAccessCode: number;
    requestNote: string;
}

class RequestAccessRouteController extends SecureRouteController<RequestAccessController> {
    userController: UserDataController = UserDataController.shared;
    constructor() {
        super();
        this.dataController = RequestAccessController.shared;

        // Configure route
        // Index for all request-access
        this.route.get('/', [adminOnlyMiddleware()], this.index);

        // Update request-access
        this.route.put('/:requestId', [adminOnlyMiddleware()], this.update);

        // Create
        this.route.post('/', this.create);
    }

    /**
     * Route's Handler
     */
    /**
     * Create Request Access
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
                this.logger.info(`index | send all request access to user ${req.user.email}`);
                return resp.status(200).json(this.getSuccessJSON(await this.dataController.all({
                    status: 0
                })));

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
                // Check status
                if (req.body.status && req.body.status !== accessRequest.status) {
                    accessRequest = await this.handleStatusUpdate(req.body.status, accessRequest, req.user);
                }
                // Save
                await this.dataController.saveInDB(accessRequest);

                // Send Response
                resp.status(200).json(this.getSuccessJSON(accessRequest));
            } catch (excp) {
                this.commonError(500, 'update', excp, resp);
                return;
            }
        };
    }

    get create(): RouteHandler {
        return async (req: Request, resp: Response) => {
            try {
                assert(req.user, 'No User of the request');
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
                resp.status(201).json(this.getSuccessJSON(requestAccess));
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
            const roles: RolesCode[] = requester.roles;
            if (!roles.includes(requestAccess.requestedAccessCode)) {
                roles.push(requestAccess.requestedAccessCode);
                requester.roles = roles;
            }
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

export const requestAccessRoutes = (): Router => {
    const controller = new RequestAccessRouteController();
    return controller.route;
};

// -----------------------------------------------------------------------
