/**
 * Test for Application Configuration
 */
import { expect, should} from 'chai';
import AppConfig from './app.config';

// Test
describe('application configuration', () => {
    it('test shared application configuration', () => {
        expect(AppConfig).not.equal(undefined);
        expect(AppConfig.appName).not.equal(undefined);
        expect(AppConfig.retryDelay).not.equal(undefined);
        expect(AppConfig.isDocker).not.equal(undefined);
        expect(AppConfig.isProduction).not.equal(undefined);
        expect(AppConfig.dbUser).not.equal(undefined);
        expect(AppConfig.dbPassword).not.equal(undefined);
        expect(AppConfig.dbName).not.equal(undefined);
        expect(AppConfig.dbHost).not.equal(undefined);
        should().exist(AppConfig.reportReceivers);
    });
});
// -----------------------------------------------------------------------------
