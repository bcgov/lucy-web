import { BaseSchema } from '../baseSchema';
import { getYAMLFilePath } from '../schemaYaml.loader';
import { getSQLFilePath, getSQLFileData } from '../sql.loader';

export class Test2Schema extends BaseSchema {
    get schemaFilePath(): string {
        return getYAMLFilePath('sample.schema.yaml');
    }

    migrationFilePath(): string {
        return getSQLFilePath(`${this.className}.sql`, this.className);
    }

    get migrationSQL(): string {
        return getSQLFileData(`${this.className}.sql`, this.className);
    }

    get createSQLDir(): boolean {
        return process.env.ENVIRONMENT === 'local' ? true : false;
    }
}

// ------------------------------------------
