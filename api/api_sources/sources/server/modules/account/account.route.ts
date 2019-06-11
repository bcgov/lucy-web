/**
 * Account route and controllers
 */

import * as assert from 'assert';
import { Request, Response, Router} from 'express';
import { SecureRouteController, roleAuthenticationMiddleware, BaseRoutController, RouteHandler } from '../../core';
import { UserDataController, User, RolesCodeValue, RoleCodeController, RolesCode } from '../../../database/models';
import { userMessagesRoute } from './messages.route';

class RolesRouteController extends BaseRoutController<RoleCodeController> {
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
     constructor() {
         super();
         this.dataController = UserDataController.shared;

         this.logger.info('Creating Account route controller');

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
         this.router.get('/user/:userId', roleAuthenticationMiddleware([RolesCodeValue.admin]), this.index);

         // Update user
         this.router.put('/user/:userId', [roleAuthenticationMiddleware([RolesCodeValue.viewer])], this.update);
         // Get All users
         this.router.get('/users', roleAuthenticationMiddleware([RolesCodeValue.admin]), this.index);


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
                let user: User;
                if (req.params.userId) {
                    user = await this.dataController.findById(req.params.userId);
                    if (user) {
                       this.logger.info(`Will update user => ${user.email}`);
                    } else {
                        this.logger.info(`No User - should handled by middleware`);
                        resp.status(422).json(this.getErrorJSON(`User id (${req.params.userId}) not exists`, []));
                    }
                } else {
                   user = req.user || req['appUser'];
                   this.logger.info(`Will update me => ${user.email}`);
                }


                // Save users
                // Updating firstName and lastName
                user.firstName = req.body.firstName || user.firstName;
                user.lastName = req.body.lastName || user.lastName;

                // Save roles if any
                const roles: number[] = req.body.roles || [];
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
         return async (req: Request, resp: Response) => {
            try {
                // Get user requested user id
                let result: User[] | User = [];
                if (req.params.userId) {
                    result = await this.dataController.findById(req.params.userId);
                } else {
                    result = await this.dataController.all();
                }
                return resp.status(200).json(this.successResp(result));
            } catch (excp) {
                this.commonError(500, 'index', excp, resp);
                return;
            }
         };
     }

 }

 export const accountRoute = (): Router => {
    const controller = new AccountRouteController();
    return controller.router;
 };

// ---------



