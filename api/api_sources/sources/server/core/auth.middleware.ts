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

import * as passport from 'passport';
import * as express from 'express';
import * as assert from 'assert';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import AppConfig from '../../AppConfig';
import { UserDataController, User, RoleCodeController, RolesCodeValue, RolesCode, UserSessionDataController, UserSession, AccountStatus } from '../../database/models';
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
    public static get shared(): ApplicationAuthMiddleware {
        return this.shareInstance || (this.shareInstance = new this());
    }
    app: any = express();
    constructor() {
        super();
    }

    async validateUser(user: User, payload?: any): Promise<MiddlewareValidationResult> {
        return { success: true };
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
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            algorithms: [algorithm],
            secretOrKey: certificate,
            passReqToCallback: true,
            ignoreExpiration: true
        };
        const jwtStrategy = new JwtStrategy(options, this._tokenCallback.bind(this));
        passport.use(jwtStrategy);
    }
    /**
     * @desc Given a keycloak token, creates a user
     * @param payload JWT Data from keycloak
     * @param api API information
     * @returns New user object
     */
    async createUserFromPayload(payload: any): Promise<User> {
        const { preferred_username, email, family_name, given_name, client_roles } = payload;
        // Creating new user with keycloak roles
        const user = UserDataController.shared.create();
        user.email = email || preferred_username;
        user.preferredUsername = preferred_username || email;
        user.firstName = given_name || 'Test';
        user.lastName = family_name || 'User';
        user.roles = await this.getRoleCodes(client_roles);
        user.accountStatus = AccountStatus.active;
        await UserDataController.shared.saveInDB(user);
        return user;
    }
    async updateUserFromPayload(payload: any, user: User) {
        const { preferred_username, email, family_name, given_name } = payload;
        user.preferredUsername = preferred_username || user.preferredUsername;
        user.email = email || user.email;
        user.firstName = given_name;
        user.lastName = family_name;
        user.accountStatus = AccountStatus.active;
        await UserDataController.shared.saveInDB(user);
        return user;
    }

    /**
     * @desc Creates a session entry for a given user
     * @param user Currently authenticated user
     * @param expiry keycloak token expiry
     * @returns updated user session
     */
    async createUserSession(user: any, expiry: number) {
        const newSession: UserSession = UserSessionDataController.shared.create();
        newSession.lastActiveAt = new Date();
        newSession.lastLoginAt = new Date();
        newSession.user = user;
        newSession.tokenExpiry = new Date((expiry * 1000) || Date.now() + AppConfig.sessionLifeTime);

        // Saving new session and users
        await UserSessionDataController.shared.saveInDB(newSession);
        await UserDataController.shared.setCurrentSession(user, newSession);
        return user;
    }

    /**
     * @desc parses user information from token and returns relevant user
     * @param preferred_username Users preferred username from jwt
     * @param email Users email address from jwt
     * @param api url pointing to api
     * @returns authenticated user
     */
    async getUserInformationFromPayload(preferred_username: string, email: string, api: string): Promise<User> {
        ApplicationAuthMiddleware.logger.info(`${api} | Fetching using preferred_username => ${preferred_username}`);
        let user: User = await UserDataController.shared.fetchOne({ preferredUsername: preferred_username });
        if (!user && email) {
            ApplicationAuthMiddleware.logger.info(`${api} | Fetching using email => ${email}`);
            user = await UserDataController.shared.fetchOne({ email: email });
        }
        return user;
    }

    /**
     * Create list of user roles in invasives-db matching the keycloak roles
     * @param roleCodes array of keycloak roles
     * @returns Correlated rolecodes
     */
    async getRoleCodes(roleCodes: string[]): Promise<Array<RolesCode>> {
        const roles = [];
        if (roleCodes.includes('admin')) { roles.push(await RoleCodeController.shared.getCode(RolesCodeValue.admin)); }
        if (roleCodes.includes('dataEditor')) { roles.push(await RoleCodeController.shared.getCode(RolesCodeValue.editor)); }
        if (roleCodes.includes('superUser')) { roles.push(await RoleCodeController.shared.getCode(RolesCodeValue.superUser)); }
        if (roleCodes.includes('inspectAppOfficer')) { roles.push(await RoleCodeController.shared.getCode(RolesCodeValue.inspectAppOfficer)); }
        if (roleCodes.includes('inspectAppAdmin')) { roles.push(await RoleCodeController.shared.getCode(RolesCodeValue.inspectAppAdmin)); }
        if (roles.length === 0) { roles.push(await RoleCodeController.shared.getCode(RolesCodeValue.viewer)); }
        return roles;
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
            // ApplicationAuthMiddleware.logger.info(`Payload: ${JSON.stringify(payload)}`);
            ApplicationAuthMiddleware.logger.disableInfoLog = true;
            const { preferred_username, email, client_roles } = payload;
            assert((preferred_username || email), `Email And Preferred user name is missing from payload\n ${JSON.stringify(payload)}`);
            const api = `${request.originalUrl}[${request.method}]`;

            // Check token expiry
            const expiry = (payload.exp * 1000);
            if (expiry && expiry < Date.now()) {
                const message = `Token is expired for user ${email}`;
                ApplicationAuthMiddleware.logger.info(message);
                if (!AppConfig.bypassTokenExpiry) {
                    ApplicationAuthMiddleware.logger.error(`Token Expire for user: ${email}`);
                    ApplicationAuthMiddleware.logger.error(`Expiry: ${expiry}: current: ${Date.now()}, Diff: ${expiry - Date.now()}`);
                    done(errorWithCode(401, message), false);
                    return;
                }
            }
            ApplicationAuthMiddleware.logger.info(`${api} | Getting user`);
            let user: User = await this.getUserInformationFromPayload(preferred_username, email, api);
            if (user) {
                // check current keycloak roles, update if they've changed
                const keycloakRoles = await this.getRoleCodes(client_roles);
                if (JSON.stringify(user.roles) !== JSON.stringify(keycloakRoles)) {
                    user.roles = keycloakRoles;
                    await UserDataController.shared.saveInDB(user);
                }
                if (user.preferredUsername !== preferred_username || user.email !== email) {
                    user = await this.updateUserFromPayload(payload, user);
                }
            } else {
                ApplicationAuthMiddleware.logger.info(`${api} | Creating new user with email and username: {${email}, ${preferred_username}}`);
                user = await this.createUserFromPayload(payload);
            }

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
                if (session.tokenExpiry < new Date() && !AppConfig.bypassTokenExpiry) {
                    const message = `${api} |  Session Expired (app internal) for user ${user.email} at ${session.tokenExpiry}`;
                    ApplicationAuthMiddleware.logger.error(message);
                    await UserDataController.shared.removeSession(user);
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
                user = await this.createUserSession(user, payload.exp);
                done(null, user);
            }
        } catch (ex) {
            ApplicationAuthMiddleware.logger.error(`_tokenCallback | Exception | ${ex}`);
            done(ex, false);
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
 * @returns middleware callback
 */
export const roleAuthenticationMiddleware = (roles: RolesCodeValue[]) => {
    return (req: express.Request, resp: express.Response, next: any) => {
        try {
            assert(req.user || req['appUser'], 'Invalid request parameters: [No User]');
            const user: User = req.user || req['appUser'];
            const userRoles = user.roles;
            const acceptedRoles = userRoles.filter((item: RolesCode) => {
                const rc: RolesCodeValue = item.code as RolesCodeValue;
                const value = roles.includes(rc);
                LoggerBase.logger.info(`roleAuthenticationMiddleware | => Role ${value ? '' : 'not '}Accepted ${rc}`);
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
export const adminOnlyRoute = () => ( roleAuthenticationMiddleware([RolesCodeValue.admin]) );
/**
 * @desc Route For Editor
 * @export closure writerOnlyRoute
 */
export const writerOnlyRoute = () => (roleAuthenticationMiddleware([RolesCodeValue.admin, RolesCodeValue.editor]) );
/**
 * @desc Route For all editors including inspect app admin
 * @export closure editorOnlyRoute
 */
export const editorOnlyRoute = () => ( roleAuthenticationMiddleware([RolesCodeValue.admin, RolesCodeValue.inspectAppAdmin, RolesCodeValue.editor]) );
/**
 * @desc Route for inspect app editor
 */
export const inspectAppEditorRoute = () => ( roleAuthenticationMiddleware([RolesCodeValue.admin, RolesCodeValue.inspectAppAdmin, RolesCodeValue.inspectAppOfficer]) );
/**
 * @desc Route for inspect app admin
 */
export const inspectAppAdminRoute = () => ( roleAuthenticationMiddleware([RolesCodeValue.admin, RolesCodeValue.inspectAppAdmin]));
