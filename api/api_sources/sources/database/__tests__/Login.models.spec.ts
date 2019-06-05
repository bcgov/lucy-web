import { User, UserDataController, LoginAccessCodeValue, UserSession, UserSessionDataController, SessionActivity, SessionActivityCodeValues, SessionActivityController } from '../models';
import { SharedDBManager } from '../DataBaseManager';
import { userFactory, sessionFactory, sessionActivityFactory } from '../factory'

describe('Test Login Data Model', () => {
    beforeAll(() => {
        return  SharedDBManager.connect();
    });
    afterAll(() => {
        return SharedDBManager.close();
    });
    test('-should create/fetch model (admin)-', async (done) => {
        const user = await userFactory(LoginAccessCodeValue.admin);
        expect(user).toBeDefined();
        let repo = SharedDBManager.connection.getRepository(User);
        await repo.save(user);
        
        if (user) {
            // Fetching
            const dbUser: User  = await repo.findOne({ email : user.email}) || new User();
            expect(dbUser).toBeDefined();
            expect(dbUser.email).toEqual(user.email);
            expect(dbUser.firstName).toEqual(user.firstName);
            expect(dbUser.lastName).toEqual(user.lastName);
            expect(dbUser.accessCodes).toBeDefined();
            expect(dbUser.accessCodes[0].code).toEqual(LoginAccessCodeValue.admin);

            // Cleaning
            repo.remove(dbUser);
        }

        done();
    });
    test('should create / fetch UserSession', async (done) => {
        // Create user-session
        const userSession = await sessionFactory(LoginAccessCodeValue.admin)
        expect(userSession).toBeDefined();

        // Save user
        try {
            await UserDataController.shared.saveInDB(userSession.user);
            await UserSessionDataController.shared.saveInDB(userSession);
        } catch(excp) {
            console.log(`Exception: ${excp}`);
            expect(expect).toBeUndefined();
            done();
        }

        // Fetch
        try {
            const dbSession = await UserSession.controller.fetchOne( {
                token: userSession.token
            });
            expect(dbSession.lastLoginAt).toEqual(userSession.lastLoginAt);
            expect(dbSession.lastActiveAt).toEqual(userSession.lastActiveAt);
            expect(dbSession.tokenLifeTime).toEqual(userSession.tokenLifeTime);
            expect(dbSession.user).toBeDefined();
            expect(dbSession.user.email).toEqual(userSession.user.email);
        } catch (excp) {
            console.log(`Exception: ${excp}`);
            expect(expect).toBeUndefined();
            
        }

        await UserDataController.shared.remove(userSession.user);
        await UserSessionDataController.shared.remove(userSession);
        
        done();
    });

    test('should create/fetch session activity', async (done) => {
        // Create session
        const sessionActivity: SessionActivity = await sessionActivityFactory(SessionActivityCodeValues.dataAdd);

        // Save
        try {
            await UserDataController.shared.saveInDB(sessionActivity.session.user);
            await UserSessionDataController.shared.saveInDB(sessionActivity.session);
            await SessionActivityController.shared.saveInDB(sessionActivity);
        } catch(excp) {
            console.log(`Exception{0}: ${excp}`);
            expect(expect).toBeUndefined();
        }

        // Fetch
        try {
            const fetchValues: SessionActivity = await SessionActivityController.shared.findById(sessionActivity.activity_id);

            expect(fetchValues.session).toEqual(sessionActivity.session);
            expect(fetchValues.info).toEqual(sessionActivity.info);
            expect(fetchValues.code).toEqual(sessionActivity.code);

        } catch(excp) {
            console.log(`Exception{1}: ${excp}`);
            expect(expect).toBeUndefined();
        }

        // Remove
        const session = sessionActivity.session;
        const user = session.user;
        await SessionActivityController.shared.remove(sessionActivity);
        await UserSessionDataController.shared.remove(session);
        await UserDataController.shared.remove(user);

        done();
    });
});