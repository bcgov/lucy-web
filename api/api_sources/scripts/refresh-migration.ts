/**
 * Imports
 */
import 'reflect-metadata';

/**
 * Application Migration task
 */
import { AppDatabaseMigrationManager } from '../sources/database/migration.helpers';

/**
 * Script
 */
(() => {
    AppDatabaseMigrationManager.shared.refresh();
})();
