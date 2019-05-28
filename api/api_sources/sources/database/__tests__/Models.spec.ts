import { User, LoginAccessCodeValue, UserSession } from '../models';
import { SharedDBManager } from '../DataBaseManager';
import { userFactory, sessionFactory } from '../factory'

describe('Test Data Model', () => {
    beforeAll(() => {
        return  SharedDBManager.connect();
    });
    afterAll(() => {
        return SharedDBManager.close();
    });
    test('-should create/fetch model (admin)-', async (done) => {
        const user = await userFactory(LoginAccessCodeValue.admin, SharedDBManager.connection);
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
            expect(dbUser.accessCode).toBeDefined();
            expect(dbUser.accessCode.code).toEqual(LoginAccessCodeValue.admin);

            // Cleaning
            repo.remove(dbUser);
        }
        done();
    });
    test('should create / fetch UserSession', async (done) => {
        // Create user-session
        const userSession = await sessionFactory(LoginAccessCodeValue.admin, SharedDBManager.connection)
        expect(userSession).toBeDefined();

        // Save user
        try {
            await User.controller.saveInDB(SharedDBManager.connection, userSession.user);
            await UserSession.controller.saveInDB(SharedDBManager.connection, userSession);
        } catch(excp) {
            console.log(`Exception: ${excp}`);
            expect(expect).toBeUndefined();
            done();
        }

        // Fetch
        try {
            const dbSession = await UserSession.controller.fetchOne(SharedDBManager.connection, {
                token: userSession.token
            })
            expect(dbSession.lastLoginAt).toEqual(userSession.lastLoginAt);
            expect(dbSession.lastActiveAt).toEqual(userSession.lastActiveAt);
            expect(dbSession.tokenExpiryTime).toEqual(userSession.tokenExpiryTime);
            expect(dbSession.user).toBeDefined();
            expect(dbSession.user.email).toEqual(userSession.user.email);
        } catch (excp) {
            expect(expect).toBeUndefined();
            
        }

        await User.controller.remove(SharedDBManager.connection, userSession.user);
        await UserSession.controller.remove(SharedDBManager.connection, userSession);
        
        done();
    });
});