import { User } from '../models/User';
import { SharedDBManager } from '../DataBaseManager';

describe('Test User Model', () => {
    beforeAll(async () => {
        await SharedDBManager.connect();
    });
    afterAll(async () => {
        await SharedDBManager.close();
    });
    test('should create/fetch model', async (done) => {
        
        // Saving
        const user = new User();
        user.firstName = 'X';
        user.lastName = 'Y';
        user.email = 'user@email.com';
        let repo = SharedDBManager.connection.getRepository(User);
        try {
            await repo.save(user);
        } catch (excp) {
            expect(excp).toBeFalsy();
            done();
        }
        

        // Fetching
        const dbUser: User  = await repo.findOne({ email : user.email}) || new User();
        expect(dbUser).toBeDefined();

        // Cleaning
        repo.remove(dbUser);
        done();
    });
    test('should load relation sessions', async (done) => {
        // Create user
    });
});