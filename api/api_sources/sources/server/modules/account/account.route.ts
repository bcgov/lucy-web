//
// Account route controller
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
import { SecureRouteController, BaseRouteController, RouteHandler, inspectAppAdminRoute, errorBody } from '../../core';
import { UserDataController, User, RoleCodeController, RolesCode, AccountStatus } from '../../../database/models';
import { userMessagesRoute } from './messages.route';
import { unWrap, LogProvider } from '../../../libs/utilities';

interface UserUpdateRequestData {
    firstName?: string;
    lastName?: string;
    roles?: number[];
    accountStatus?: number;
}

const checkAdmin = (provider: LogProvider) => async (req: any, res: any, next: any) => {
    if (req.params.userId) {
        // Getting user
        const user = await UserDataController.shared.findById(req.params.userId);
        const logger = provider();
        if (user) {
           const reqUser: User = req.user as User;
           if (reqUser.isInspectAppAdmin && !user.isInspectAppEditor) {
               logger.error(`Inspect App Admin tries to update non officer user`);
               res.status(401).json(errorBody('Un-authorize users', []));
               return;
           }
        }
    }
    next();
};

/**
 * @description Route controller to fetch all routes
 */
class RolesRouteController extends BaseRouteController<RoleCodeController> {
    constructor() {
        super();
        this.dataController = RoleCodeController.shared;

        // Routes
        this.router.get('/', this.index);
    }

    get index(): RouteHandler {
        return async (req: Request, resp: Response) => {
            assert(req, 'No request object');
            const roles = await this.dataController.all();
            return resp.status(200).json(this.successResp(roles));
        };
    }
}
/**
 * AccountRouteController
 * @description Account route controller
 */
 class AccountRouteController extends SecureRouteController<UserDataController> {
     roleRouteController: RolesRouteController = new RolesRouteController();
     static get shared(): AccountRouteController {
        return this.sharedInstance() as AccountRouteController;
    }
     constructor() {
         super();
         this.dataController = UserDataController.shared;

         // this.logger.info('Creating Account route controller');

         // Route Configure
         // Get roles
         this.router.use('/roles', this.roleRouteController.router);

         // User messages
         this.router.use('/message', userMessagesRoute());

         // Get own info
         this.router.get('/me', this.me);

         // Update own info
         this.router.put('/me', this.update);

         // Get user info
         this.router.get('/user/:userId',
         [
             inspectAppAdminRoute(),
            checkAdmin(() => AccountRouteController.shared.logger)
         ], this.index);

         // Update user
         this.router.put('/user/:userId',
         [
             inspectAppAdminRoute(),
            checkAdmin(() => AccountRouteController.shared.logger)],
            this.update);
         // Get All users
         this.router.get('/users', [inspectAppAdminRoute()], this.index);
     }

     /**
      * @description User info route handling
      * @return RouteHandler
      */
     get me(): RouteHandler {
         return async (req: Request, res: Response) => {
            assert(req);
            assert(req.user);
            return res.status(200).json(this.successResp(req.user || req['appUser']));
         };
     }

     /**
      * @description User info update route
      * @return RouteHandler
      */
     get update(): RouteHandler {
         return async (req: Request, resp: Response) => {
             try {
                const update: UserUpdateRequestData = req.body as UserUpdateRequestData;
                assert(update, 'Unknown request body, should handle by validator');
                let user: User;
                if (req.params.userId) {
                    // Getting user
                    user = await this.dataController.findById(req.params.userId);
                    if (user) {
                       this.logger.info(`Will update user by admin => ${user.email}`);
                       await this.updateUserByAdmin(user, update);
                    } else {
                        this.logger.info(`No User - should handled by middleware`);
                        resp.status(422).json(this.getErrorJSON(`User id (${req.params.userId}) not exists, should handled by middleware`, []));
                    }
                } else {
                   user = req.user;
                   this.logger.info(`Will update me => ${user.email}`);
                }


                // Save users
                // Updating firstName and lastName
                user.firstName = update.firstName || user.firstName;
                user.lastName = update.lastName || user.lastName;

                // Saving
                await this.dataController.saveInDB(user);
                this.logger.info(`Update user ${user.email}`);
                // Response
                resp.status(200).json(this.successResp(user, 'Data Updated'));

             } catch (excp) {
                this.commonError(500, 'update', excp, resp);
                return;
             }
         };
     }

     /**
      * @description Any user or all users info route handling
      * @return RouteHandler
      */
     get index(): RouteHandler {
         return async (req: any, resp: Response) => {
            try {
                // Get user requested user id
                const user: User = req.user as User;
                let result: User[] | User = [];
                if (req.params.userId) {
                    result = await this.dataController.findById(req.params.userId);
                } else {
                    result = await this.dataController.all();
                    if (user.isInspectAppAdmin) {
                        result = result.filter( item => item.isInspectAppEditor);
                    }
                }
                return resp.status(200).json(this.successResp(result));
            } catch (excp) {
                this.commonError(500, 'index', excp, resp);
                return;
            }
         };
     }

     /**
      * Helpers
      */
     /**
      * @description Helper method to update user by admin
      * @param User user
      * @param UserUpdateRequestData update
      */
     async updateUserByAdmin(user: User, update: UserUpdateRequestData) {
         // Save roles if any, role update only available from user in param
         const roles: number[] = update.roles || [];
         if (roles.length > 0) {
             const userRoles: RolesCode[] = [];
             for (const role of roles) {
                 const roleCode = await RoleCodeController.shared.findById(role);
                 if (roleCode) {
                     userRoles.push(roleCode);
                 }
             }
             if (userRoles.length > 0) {
                 this.logger.info(`Adding user roles => ${JSON.stringify(roles)}`);
                 user.roles = userRoles;
             }
         }

         // Update account status if any
         user.accountStatus = unWrap(update.accountStatus, unWrap(user.accountStatus, AccountStatus.active));

         this.logger.info(`Update object ${JSON.stringify(update)}, user: ${JSON.stringify(user)}`);

         return;
     }

}

/**
 * @description Getter for account route
 */
export const accountRoute = (): Router => {
    const controller = AccountRouteController.shared;
    return controller.router;
};
// -----------------------------------------------------------------------------------------------------------




