
import AppConfig  from './app.config'

// Test
describe('application configuration', () => {
    test('test shared application configuration', () => {
        expect(AppConfig).toBeDefined();
        expect(AppConfig.appName).toBeDefined();
        expect(AppConfig.retryDelay).toBeDefined();
        expect(AppConfig.isDocker).toBeDefined();
        expect(AppConfig.isProduction).toBeDefined();
        expect(AppConfig.dbUser).toBeDefined();
        expect(AppConfig.dbPassword).toBeDefined();
        expect(AppConfig.dbName).toBeDefined();
        expect(AppConfig.dbHost).toBeDefined();
    });
});