/**
 * Account route and controllers
 */

import { Request, Response, Router} from 'express';
import { SecureRouteController, roleAuthenticationMiddleware, BaseRoutController } from '../../core';
import { UserDataController, User, RolesCodeValue, RoleCodeController } from '../../../database/models';
import * as assert from 'assert';

class RolesRouteController extends BaseRoutController<RoleCodeController> {
    constructor() {
        super();
        this.dataController = RoleCodeController.shared;

        // Routes
        this.route.get('/', this.index.bind(this))
    }

    async index(req: Request, res: Response) {
        assert(req, 'No request object');
        let roles = await this.dataController.all();
        return res.status(200).json(this.getSuccessJSON(roles));
    }
}

 class AccountRouteController extends SecureRouteController<UserDataController> {
     roleRouteController: RolesRouteController = new RolesRouteController();
     constructor() {
         super();
         this.dataController = UserDataController.shared;

         this.logger.info('Creating Account route controller');

         // Route Configure
         // Get roles
         this.route.use('/roles', this.roleRouteController.route);
         
         // Get own info
         this.route.get('/me', this.me.bind(this));

         // Update own info
         this.route.put('/me', this.updateMe.bind(this))

         // Get user info
         this.route.get('/user/:userId',roleAuthenticationMiddleware([RolesCodeValue.admin]), this.index.bind(this));
         // Get All users
         this.route.get('/users', roleAuthenticationMiddleware([RolesCodeValue.admin]), this.index.bind(this));


     }

     async me(req: Request, resp: Response) {
         assert(req);
         assert(req.user || req['appUser']);
         return resp.status(200).json(this.getSuccessJSON(req.user || req['appUser']));
     }

     async updateMe(re: Request, resp: Response) {

     }

     async update(req: Request, resp: Response) {

     }

     async index(req: Request, resp: Response) {
         // Get user requested user id
         let result: User[] = [];
         if (req.params.userId) {
            result = [ await this.dataController.findById(req.params.userId)]
         } else {
            result = await this.dataController.all()
         }
         return resp.status(200).json(this.getSuccessJSON(result));
     }

 }

 export const accountRoute = (): Router => {
    let controller = new AccountRouteController(); 
    return controller.route;
 }


