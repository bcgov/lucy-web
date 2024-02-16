# Migrations

This is an abridged version to make a new table in the database. A more robust version of these steps exist in the [Form Framework README here](FormFrameworkREADME.md).

---

1. [Creating a New Table](#creating-a-new-table)
1. [Create the YAML File](#create-the-yaml-file)
1. [Define the Schema](#define-the-schema)
1. [Creating the Handler](#creating-the-handler)
1. [New Sub-directory, SQL file, Model, and Controller](#new-sub-directory-sql-file-model-and-controller)
1. [Creating the Migration File](#creating-the-migration-file)
1. [Run the Migration](#run-the-migration)


## Creating a New Table

To add a new table you would need to follow these steps in the running Docker container. From the `/api` directory, use the command `make api` to shell into the `invasivesbc-lucy-api` container. You'll need to `cd` into the `scripts` folder. 

> *Note the* `camelCase` *vs* `PascalCase` *vs* `snake_case` *in the commands and namings below*

### Create the YAML File

Start by generating a skeleton YAML file for the schema using the `create.schema.ts` script. You can do this by running the following command: 

```
ts-node create.schema.ts -s [TableName] 
```

This will create a new YAML file in the `api/api_sources/schema-files` directory with the name `[tableName].schema.yaml`

### Define the Schema

Open the newly created `[tableName].schema.yaml` file and define the schema using a similar template below: 

> *Note: This YAML file defines the* `BlowBy table` *with the columns* `blowByTime`, `watercraftComplexity`*, and* `reportedToRapp`. *The relations section establishes a many-to-one relationship with the* `observer_workflow` *table*

```yml
version: '1.0' 
description: Schema file for table blow_by 
externalTables: [] 
includes: 
  - observerWorkflow.schema.yaml 
schemas: 
  BlowBySchema: 
    name: blow_by 
    description: 'Table to store blow by data for watercraft observer.' 
    baseSchema: RecordSchema 
    meta: 
      resource: true 
      api: /mussels/blow-bys 
      base: api 
    resource: true 
    baseModel: Record 
    columns: 
      id:  
        name: blow_by_id 
        comment: Auto generated primary key 
        definition: SERIAL PRIMARY KEY 
      observerWorkflowId: 
        name: observer_workflow_id 
        comment: Foreign key to observer_workflow 
        definition: INT NULL 
        foreignTable: observer_workflow 
        refColumn: observer_workflow_id 
      blowByTime: 
        name: blow_by_time 
        comment: Time of blow by 
        definition: VARCHAR(100) NULL 
      watercraftComplexity: 
        name: watercraft_complexity 
        comment: Watercraft complexity 
        definition: VARCHAR(100) NULL 
      reportedToRapp: 
        name: reported_to_rapp 
        comment: Reported to rapp 
        definition: BOOLEAN NOT NULL DEFAULT false 
    relations: 
      observerWorkflow: 
        header: 
          key: blow_by.observer_workflow 
          default: Observer Workflow 
        description: 
          key: blow_by.observer_workflow.description 
          default: Observer workflow associated with the blow by 
        type: single 
        relationshipType: many-to-one 
        schema: ObserverWorkflowSchema 
        meta: 
          skipValidation: true 
    versions: [] 
    fields: {} 

```

### Creating the Handler

Next, create a handler for the schema. In the `api/api_sources/sources/database/database-schema/musselApp.schema.ts` file, add the following code:

```ts
export class [TableName]Schema extends RecordTableSchema { 
    get schemaFilePath(): string { 
        return getYAMLFilePath('[tableName].schema.yaml'); 
    } 
} 

```

### New Sub-directory, SQL file, Model, and Controller

Now, create a new sub-directory inside the `api/api_sources/schema-migration-sql` directory named `[TableName]Schema`. Then, execute the following command: 

```
ts-node schema.manager.ts -s [TableName]Schema –m 
```

> *Note: the names must match what’s in the YAML file under* `schemas`

- This command generates a SQL file inside the `[TableName]Schema` sub-directory and a `[tableName].ts` file inside `api/api_sources/sources/database/models/` as well as a `[tableName.controller.ts` file. The SQL file creates and configures the `[TableName]` table in the database. 

- The `[tableName].ts` file will import some classes that might not be used in the new table – this will throw a linting error if not removed. 

- The `[tableName].controller.ts` file will be pretty sparse when it’s created. Use this template to update the file as needed: 

```ts
// ** BlowByController ** // 
import { RecordController } from '../generic.data.models';
import { BlowBy} from '../../models';
import { BlowBySchema } from '../../database-schema';

/**
* @description Data Model Controller Class for BlowBySchema and BlowBy
*/
export class BlowByController extends RecordController<BlowBy> {
    /**
    * @description Getter for shared instance
    */
    public static get shared(): BlowByController {
        return this.sharedInstance<BlowBy>(BlowBy, BlowBySchema) as BlowByController;
    }
 
    public async all(query?: any): Promise<BlowBy[]> {
        const options = query || {};
        options.relations = ['observerWorkflowId'];
        return await this.repo.find(options) as BlowBy[];
    }
    
    get exportKeyPriorities(): {[key: string]: number} {
        const basePriority = 1000;
        const topPriority = 100;
        return {
            id: basePriority + topPriority,
            observerWorkflowId: (basePriority + topPriority - 10),
            blowByTime: (basePriority + topPriority - 50),
            watercraftComplexity: (basePriority + topPriority - 60),
            reportedToRapp: (basePriority + topPriority - 70),
        };
    }
 
    processForExport(data: BlowBy): any {
        const result: any = {};
        Object.keys(data).forEach((key) => {
        if (this.exportKeyMapper[key]) {
            result[this.exportKeyMapper[key]] = data[key];
        }
    });
    
    return result;
    }
}
// ---------------- 

```

### Creating the Migration File

To generate a SQL migration file, shell into the Docker container using `make api` and execute the following command: 

```
typeorm migration:create -n MigrationFor[TableName] 
```

This command generates a SQL migration file and a TypeScript file in the `scripts` directory. You’ll need to move it to the `migrations` directory.

In the newly created migration file, make the proper changes for the `UP` and `DOWN` commands, similar to this template:

```ts
import {MigrationInterface, QueryRunner} from 'typeorm';
import { AppDBMigrator } from '../applicationSchemaInterface';
import { BlowBySchema, ObserverWorkflowSchema } from '../database-schema';
 
export class CreateBlowBy1703888022971 extends AppDBMigrator implements MigrationInterface {
   blowBySchema: BlowBySchema;
   observerWorkflowSchema: ObserverWorkflowSchema;
 
   /**
    * Setup
    */
   setup() {
       // Adding BlowBy schema to migrator
       this.blowBySchema = new BlowBySchema();
       this.observerWorkflowSchema = new ObserverWorkflowSchema();
 
       // Create BlowBy table
       this.addSchemaInitVersion(this.blowBySchema);
 
       // Add FK ref
       this.addUpMigration(this.blowBySchema.className, 'BlowByConstraint.sql');
   }
 
   /**
    * UP: Create DB method
    */
   public async up(queryRunner: QueryRunner): Promise<any> {
       // Start Log
       this.log('[START]', 'UP');
       // Running all up migration files
       await this.runQuerySqlFiles(this.upMigrations(), queryRunner);
       this.log('[END]', 'UP');
   }
 
   /**
    * Down: Revert
    */
   public async down(queryRunner: QueryRunner): Promise<any> {
       this.log('[START]', 'DOWN');
       await queryRunner.query(this.blowBySchema.dropTable());
       await queryRunner.query(this.observerWorkflowSchema.dropTable());
       this.log('[END]', 'DOWN');
   }
}

``` 

### Run the Migration

Finally, run the database migration by executing the following command: 

```
npm run migration
```
