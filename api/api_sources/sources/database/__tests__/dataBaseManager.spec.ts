// Unit test for database manger
import { SharedDBManager } from '../dataBaseManager';

// Test
describe('Database Manager and models', () => {
    beforeAll(async () => {
        return  await SharedDBManager.connect();
    });
    afterAll(async () => {
        return await SharedDBManager.close();
    });
    test('test shared database manager', () => {
        const dbManager = SharedDBManager;
        expect(dbManager).toBeDefined();
    });
    test('database manager should connect', async (done) => {
        expect(SharedDBManager.connection).toBeDefined();
        done();
    });
});

//// -----------
