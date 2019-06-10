// Unit test for database manger
import { SharedDBManager } from './dataBaseManager'

// Test
describe('Database Manager and models', () => {
    test('test shared database manager', () => {
        const dbManager = SharedDBManager;
        expect(dbManager).toBeDefined();
    });
    test('database manager should connect', async (done) => {
        await SharedDBManager.connect();
        expect(SharedDBManager.connection).toBeDefined();
        await SharedDBManager.close();
        done();
    });
});