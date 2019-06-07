// Application Auth Middleware
import * as passport from 'passport';
import * as express from 'express';
import * as assert from 'assert';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import AppConfig from '../../AppConfig'
import { UserDataController, User, RoleCodeController, RolesCodeValue, RolesCode, UserSessionDataController} from '../../database/models';
import { LoggerBase } from '../logger';
import { errorBody } from './common.error.handler';

const commonUtility = require('@bcgov/nodejs-common-utils');

export interface MiddlewareValidationResult {
    message?: string,
    code?: number,
    success: boolean
}

export class ApplicationAuthMiddleware extends LoggerBase {
    private static shareInstance: any;
    app: any = express();

    public static get shared(): ApplicationAuthMiddleware {
        return this.shareInstance || (this.shareInstance = new this());
    }

    constructor() {
        super()
        this._configure();
    }

    async validateUser(user: User, payload?: any): Promise<MiddlewareValidationResult> {
        return {success: true};
    }

    async _configure() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        const { getJwtCertificate} = commonUtility;
        assert(getJwtCertificate, 'No getJwtCertificate lib');

        // Get algorithm and public key
        const { algorithm, certificate } = await getJwtCertificate(AppConfig.certificateURL);
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

    async _tokenCallback(request: express.Request, payload: any, done: any) {
        const { errorWithCode } = commonUtility;
        try {
            // Get user info
             const { preferred_username, email, family_name, given_name} = payload;
             assert(preferred_username, 'JWT payload preferred_username is missing');
             assert(email, 'JWT payload email is missing');
             assert(family_name, 'JWT payload family_name is missing');
             assert(given_name, 'JWT payload given_name is missing');

             // Check token expiry
             let expiry = (payload.exp * 1000);
             if (expiry && expiry > Date.now()) {
                 let message = `Token is expired for user ${email}`;
                 ApplicationAuthMiddleware.logger.info(message);
                 if (!AppConfig.bypassTokenExpiry) {
                    done(errorWithCode(401, message), false);
                    return;
                 } else {
                    ApplicationAuthMiddleware.logger.info(`Allowing user in dev env`);
                 }
             }

             // Get user
             ApplicationAuthMiddleware.logger.info(`Getting user`);
             let user: User = await UserDataController.shared.fetchOne({email: email})
             if (!user) {
                 ApplicationAuthMiddleware.logger.info(`Creating new user with email and username: {${email}, ${preferred_username}}`);

                 // Creating new user with viewer role
                 user = UserDataController.shared.create();
                 user.email = email;
                 user.preferredUsername = preferred_username;
                 user.firstName = given_name;
                 user.lastName = family_name;
                 user.accessCodes = [await RoleCodeController.shared.getCode(RolesCodeValue.viewer)];

                 await UserDataController.shared.saveInDB(user);
             }

             ApplicationAuthMiddleware.logger.info(`User {${user.email}, ${user.preferredUsername}`);

             // Checking user validity {for subclasses}
             const valid: MiddlewareValidationResult = await this.validateUser(user, payload);
             if (!valid.success) {
                 done(errorWithCode(valid.message, valid.code), false)
                 return;
             }

             // Session Handling
             const session = await user.currentSession();
             if (session) {
                 // Check session validity
                 if (session.tokenExpiry > new Date() && !AppConfig.bypassTokenExpiry) {
                     let message = `Session Expire for user ${user.email} at ${session.tokenExpiry}`;
                     ApplicationAuthMiddleware.logger.info(message);
                     // Remove current
                     await user.removeCurrentSession();
                      // Fail Session
                    done(errorWithCode(message, 401));
                 } else {
                    ApplicationAuthMiddleware.logger.info(`Session Active for user ${user.email}`);
                     session.lastActiveAt = new Date();
                     session.tokenExpiry = new Date((payload.exp * 1000) || Date.now() + AppConfig.sessionLifeTime)
                     request['appUser'] = user;
                     done(null, user);
                 }
             } else {
                 ApplicationAuthMiddleware.logger.info(`Create New Session for user ${user.email}`);
                 let session = UserSessionDataController.shared.create();
                 session.lastActiveAt = new Date();
                 session.lastLoginAt = new Date();
                 session.user = user;
                 session.tokenExpiry = new Date((payload.exp * 1000) || Date.now() + AppConfig.sessionLifeTime)
                 await UserSessionDataController.shared.saveInDB(session);
                 await user.setCurrentSession(session);

                 done(null, user);
             }

        } catch(excp) {
            ApplicationAuthMiddleware.logger.error(`_tokenCallback | Exception | ${excp}`);
            done(excp, false)
        }
    }
}

export const authenticationMiddleWare = () => {
    return ApplicationAuthMiddleware.shared.app;
};

export const roleAuthenticationMiddleware = (roles: RolesCodeValue[]) => {
    
    return (req: express.Request, resp: express.Response, next: any) => {
        try {
            assert(req.user || req['appUser'], 'Invalid request parmas: [No User]');
            const user: User = req.user || req['appUser'];
            const userRoles = user.accessCodes;
            const acceptedRoles = userRoles.filter((item: RolesCode) => {
                let rc: RolesCodeValue = item.code as RolesCodeValue;
                let value = roles.includes(rc);
                if (value) {
                    LoggerBase.logger.info(`roleAuthenticationMiddleware => true ${rc}`);
                } else {
                    LoggerBase.logger.info(`roleAuthenticationMiddleware => false ${rc}`);
                }
                
                return value
            });
            return acceptedRoles.length > 0 ? next() : (resp.status(401).json(errorBody('User role is not authorized to access this route', [{
                acceptedRoles: `Accepted roles are [${roles}]`
            }])));

        } catch(excp) {
            resp.status(500).json(errorBody(`${excp}`, [excp]));
        }
    }
}