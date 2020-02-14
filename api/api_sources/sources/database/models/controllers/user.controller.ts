
import { User} from '../user';
import { UserSession, UserSessionDataController } from '../user.session';
import { DataModelController } from '../../data.model.controller';
import { UserSchema } from '../../database-schema';
import { setNull } from '../../../libs/utilities';
import { RequestAccess } from '../requestAccess';
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

    public async latestAccessRequest(user: User): Promise<RequestAccess | undefined> {
        const allRequest: RequestAccess[] = await user.requestAccess;
        if (allRequest && allRequest.length > 0) {
            const sorted = allRequest.sort( (item1, item2) => {
                return item2.request_id < item1.request_id ? -1 :
                (item2.request_id > item1.request_id) ? 1 : 0;
            });
            return sorted[0];
        }
        return;
    }
}

// ------------------------------------------------------------
