
import { User} from '../user';
import { UserSession, UserSessionDataController } from '../user.session';
import { DataModelController } from '../../data.model.controller';
import { UserSchema } from '../../database-schema';
import { setNull } from '../../../libs/utilities';
/**
 * @description Data Model Controller for User
 * @export class UserDataController
 */
export class UserDataController extends DataModelController<User> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): UserDataController {
        return this.sharedInstance<User>(User, UserSchema) as UserDataController;
    }

    /**
     * @description Get current session of given user
     * @method getCurrentSession
     * @param User user
     * @return Promise<UserSession>
     */
    public async getCurrentSession(user: User): Promise<UserSession> {
        if (user.activeSessionId) {
            return await UserSessionDataController.shared.findById(user.activeSessionId);
        }
        return {} as UserSession;
    }

    /**
     * @description Set current session of given user
     * @method setCurrentSession
     * @param User user
     * @param UserSession session
     * @return Promise<void>
     */
    public async setCurrentSession(user: User, session: UserSession): Promise<void> {
        user.activeSessionId = session.session_id;
        await this.saveInDB(user);
    }

    /**
     * @description Remove current session of given user
     * @method removeSession
     * @param User user
     * @return Promise<void>
     */
    public async removeSession(user: User): Promise<void> {
        setNull<User>(user, 'activeSessionId');
        await this.saveInDB(user);
    }
}

// ------------------------------------------------------------
