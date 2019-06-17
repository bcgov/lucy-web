/**
 * User Messages route
 */
import * as assert from 'assert';
import { Request, Response, Router} from 'express';
import { RouteHandler, BaseRoutController } from '../../core';
import { UserMessageController, UserMessageStatus, UserMessage } from '../../../database/models';

 class UserMessagesRoute extends BaseRoutController<UserMessageController> {
     constructor() {
         super();
         this.dataController = UserMessageController.shared;

         // Route config
         // Get all unseen messages
         this.router.get('/', this.index);

         // Update message with id
         this.router.put('/:messageId', this.update);
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
                 const user = req.user;
                 const userMessages: UserMessage[] = await user.message;
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
                message.status = req.body.status || message.status;
                // Save
                await this.dataController.saveInDB(message);
                return resp.status(200).json(this.successResp(message));
             } catch (excp) {
                 this.commonError(500, 'update', excp, resp);
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

// -----------------------
