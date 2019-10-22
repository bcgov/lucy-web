//
// Account/Message route controller
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
import { UserMessageController, UserMessageStatus, UserMessage, User } from '../../../database/models';
import { unWrap } from '../../../libs/utilities';

/**
 * @description Interface for UserMessage Create Request body
 */
export interface UserMessageCreateRequest {
    receiver: number;
    title: string;
    body: string;
    type?: number;
}

/**
 * @description UserMessage route handler
 * @export class UserMessagesRoute
 */
 class UserMessagesRoute extends SecureRouteController<UserMessageController> {
     constructor() {
         super();
         this.dataController = UserMessageController.shared;

         // Route config
         // Get all unseen messages
         this.router.get('/', this.index);

         // Update message with id
         this.router.put('/:messageId', this.update);

         // Create Message
        this.router.post('/', [adminOnlyRoute()] , this.create);
     }

     /**
      * Index route for user messages
      * @return RouteHandler
      */
     get index(): RouteHandler {
         return async (req: Request, resp: Response) => {
             try {
                 assert(req.user, 'No User of request, should handle by middleware');
                 this.logger.info(`Will Fetch messages for user ${req.user.email}`);
                 const user: User = req.user as User;
                 const userMessages: UserMessage[] = await user.messages || [];
                 const results = userMessages.filter( msg => {
                     return (msg.status === UserMessageStatus.unseen);
                 });
                 return resp.status(200).json(this.successResp(results));
             } catch (excp) {
                 this.commonError(500, 'index', excp, resp);
                 return;
             }
         };
     }

     /**
      * Update Route for user message
      * @return RouteHandler
      */
     get update(): RouteHandler {
         return async (req: Request, resp: Response) => {
             try {
                assert(req.user, 'No User of request, should handle by middleware');
                assert(req.params.messageId, 'No Message id in req, should handle by validator');
                this.logger.info(`Will update message (${req.params.messageId}) for ${req.user.email}`);

                // Fetch message
                const message: UserMessage = await  this.dataController.findById(req.params.messageId);
                assert(message, `No message is available with given id ${req.params.messageId}, should handle by validator`);
                // Only status can be updated
                message.status = unWrap(req.body.status, unWrap(message.status, UserMessageStatus.unseen));
                // Save
                await this.dataController.saveInDB(message);
                return resp.status(200).json(this.successResp(message));
             } catch (excp) {
                 this.commonError(500, 'update', excp, resp);
                 return;
             }
         };
     }

     get create(): RouteHandler {
         return async (req: Request, resp: Response) => {
             try {
                assert(req.user, 'No User of request, should handle by auth middleware');
                // Get param
                const reqBody: UserMessageCreateRequest = req.body as UserMessageCreateRequest;
                assert(reqBody, 'Unknown request body should be handled by validator');
                // Get receiver
                const receiver: User = await this.userController.findById(reqBody.receiver);
                assert(receiver, 'Invalid receiver, should handle by validator');
                // Create Message
                const message: UserMessage = this.dataController.create();
                message.body = reqBody.body;
                message.title = reqBody.title;
                message.type = reqBody.type || 0;
                message.status = 0;
                message.receiver = receiver;
                message.creator = req.user;
                // Save
                await this.dataController.saveInDB(message);
                // Send back message
                return resp.status(200).json(this.successResp(message));
             } catch (excp) {
                this.commonError(500, 'create', excp, resp);
                return;
            }
         };
     }
 }

/**
 * @description Function which return user messages router
 * @export const userMessagesRoute
 */
export const userMessagesRoute = (): Router => {
    const controller = new UserMessagesRoute();
    return controller.router;
};
// -----------------------------------------------------------------------------------------------------------

