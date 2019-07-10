//
// Auth Middleware
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
// Created by Pushan Mitra on 2019-06-6.
/**
 * Imports
 */
import * as passport from 'passport';
import * as express from 'express';
import * as assert from 'assert';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import AppConfig from '../../AppConfig';
import { UserDataController, User, RoleCodeController, RolesCodeValue, RolesCode, UserSessionDataController, UserSession, AccountStatus} from '../../database/models';
import { LoggerBase } from '../logger';
import { errorBody } from './common.error.handler';
import { BCHelperLib } from '../../libs/utilities/bc.helpers';

/**
 * @description Model interface for Middleware result
 * @export interface MiddlewareValidationResult
 */
export interface MiddlewareValidationResult {
    message?: string;
    code?: number;
    success: boolean;
}
/**
 * @description JWT bases passport auth middleware manager
 * @export class ApplicationAuthMiddleware
 */
export class ApplicationAuthMiddleware extends LoggerBase {
    private static shareInstance: any;
    app: any = express();

    public static get shared(): ApplicationAuthMiddleware {
        return this.shareInstance || (this.shareInstance = new this());
    }

    constructor() {
        super();
    }

    async validateUser(user: User, payload?: any): Promise<MiddlewareValidationResult> {
        return {success: true};
    }

    /**
     * @description Configure passport and app
     */
    async _configure() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        // Get algorithm and public key
        const { algorithm, certificate } = await BCHelperLib.getCertificate();
        const options: StrategyOptions = {
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            algorithms: [algorithm],
            secretOrKey: certificate,
            passReqToCallback: true,
            ignoreExpiration: true
        };
        const jwtStrategy = new JwtStrategy(options, this._tokenCallback.bind(this));

        passport.use(jwtStrategy);
    }

    /**
     * @description Passport token callback
     * @param express.Request request
     * @param any payload
     * @param any closure done
     */
    async _tokenCallback(request: express.Request, payload: any, done: any) {
        const { errorWithCode } = BCHelperLib.getCommonUtility();
        try {
            // Get user info
             const { preferred_username, email, family_name, given_name} = payload;
             assert(preferred_username, 'JWT payload preferred_username is missing');
             assert(email, 'JWT payload email is missing');
             assert(family_name, 'JWT payload family_name is missing');
             assert(given_name, 'JWT payload given_name is missing');
             const api = `${request.originalUrl}[${request.method}]`;
             ApplicationAuthMiddleware.logger.info(`Payload: ${JSON.stringify(payload)}`);

             // Check token expiry
             const expiry = (payload.exp * 1000);
             if (expiry && expiry > Date.now()) {
                 const message = `Token is expired for user ${email}`;
                 ApplicationAuthMiddleware.logger.info(message);
                 if (!AppConfig.bypassTokenExpiry) {
                    done(errorWithCode(401, message), false);
                    return;
                 } else {
                    ApplicationAuthMiddleware.logger.info(`${api} | Allowing user in dev env`);
                 }
             }

             // Get user
             ApplicationAuthMiddleware.logger.info(`${api} | Getting user`);
             let user: User = await UserDataController.shared.fetchOne({email: email});
             if (!user) {
                 ApplicationAuthMiddleware.logger.info(`${api} | Creating new user with email and username: {${email}, ${preferred_username}}`);

                 // Creating new user with viewer role
                 user = UserDataController.shared.create();
                 user.email = email;
                 user.preferredUsername = preferred_username;
                 user.firstName = given_name;
                 user.lastName = family_name;
                 user.roles = [await RoleCodeController.shared.getCode(RolesCodeValue.viewer)];
                 user.accountStatus = AccountStatus.active;
                 await UserDataController.shared.saveInDB(user);
             } else {
                 // Update user data if require
                 if (user.preferredUsername !== preferred_username) {
                    user.preferredUsername = preferred_username;
                    user.firstName = given_name;
                    user.lastName = family_name;
                    user.accountStatus = AccountStatus.active;
                    await UserDataController.shared.saveInDB(user);
                 }
             }

             ApplicationAuthMiddleware.logger.info(`${api} | User {${user.email}, ${user.preferredUsername} and status: ${user.accountStatus}}`);

             // Checking and creating status
             if (user.accountStatus === undefined) {
                 user.accountStatus = AccountStatus.active;
                 await UserDataController.shared.saveInDB(user);
                 ApplicationAuthMiddleware.logger.info(`Creating status for user: ${user.email}`);
             }

             // Checking user validity {for subclasses}
             const valid: MiddlewareValidationResult = await this.validateUser(user, payload);
             if (!valid.success) {
                 done(errorWithCode(valid.message, valid.code), false);
                 return;
             }

             // Session Handling
             const session = await UserDataController.shared.getCurrentSession(user);
             if (session) {
                 // Check session validity
                 if (session.tokenExpiry > new Date() && !AppConfig.bypassTokenExpiry) {
                     const message = `${api} |  Session Expire for user ${user.email} at ${session.tokenExpiry}`;
                     ApplicationAuthMiddleware.logger.info(message);
                     // Remove current
                     await UserDataController.shared.removeSession(user);
                      // Fail Session
                    done(errorWithCode(message, 401));
                 } else {
                    ApplicationAuthMiddleware.logger.info(`${api} | Session Active for user ${user.email}`);
                     session.lastActiveAt = new Date();
                     session.tokenExpiry = new Date((payload.exp * 1000) || Date.now() + AppConfig.sessionLifeTime);
                     request['appUser'] = user;
                     done(null, user);
                 }
             } else {
                 // Create New Session
                 ApplicationAuthMiddleware.logger.info(`${api} | Create New Session for user ${user.email}`);
                 const newSession: UserSession = UserSessionDataController.shared.create();
                 newSession.lastActiveAt = new Date();
                 newSession.lastLoginAt = new Date();
                 newSession.user = user;
                 newSession.tokenExpiry = new Date((payload.exp * 1000) || Date.now() + AppConfig.sessionLifeTime);

                 // Saving new session and users
                 await UserSessionDataController.shared.saveInDB(newSession);
                 await UserDataController.shared.setCurrentSession(user, newSession);
                 done(null, user);
             }

        } catch (excp) {
            ApplicationAuthMiddleware.logger.error(`_tokenCallback | Exception | ${excp}`);
            done(excp, false);
        }
    }
}

/**
 * @description Exposing Auth middleware
 * @export closure authenticationMiddleWare
 */
export const authenticationMiddleWare = async (): Promise<void> => {
    await ApplicationAuthMiddleware.shared._configure();
    return ApplicationAuthMiddleware.shared.app;
};

/**
 * @description Role authentication middleware
 * @export closure roleAuthenticationMiddleware
 * @param RolesCodeValue[] roles
 */
export const roleAuthenticationMiddleware = (roles: RolesCodeValue[]) => {
    // Returning Middleware callback
    return (req: express.Request, resp: express.Response, next: any) => {
        try {
            assert(req.user || req['appUser'], 'Invalid request parameters: [No User]');
            const user: User = req.user || req['appUser'];
            const userRoles = user.roles;
            const acceptedRoles = userRoles.filter((item: RolesCode) => {
                const rc: RolesCodeValue = item.code as RolesCodeValue;
                const value = roles.includes(rc);
                if (value) {
                    LoggerBase.logger.info(`roleAuthenticationMiddleware | => Role Accepted ${rc}`);
                } else {
                    LoggerBase.logger.info(`roleAuthenticationMiddleware | => Role Not Accepted ${rc}`);
                }
                return value;
            });
            return acceptedRoles.length > 0 ? next() : (resp.status(401).json(errorBody('User role is not authorized to access this route', [{
                acceptedRoles: `Accepted roles are [${roles}]`
            }])));

        } catch (excp) {
            resp.status(500).json(errorBody(`${excp}`, [excp]));
        }
    };
};

/**
 * @description Admin only route check authentication middleware
 * @export closure adminOnlyRoute
 */
export const adminOnlyRoute = () => {
    return roleAuthenticationMiddleware([RolesCodeValue.admin]);
};
// -----------------------------------------------------------------------------------------------------------
