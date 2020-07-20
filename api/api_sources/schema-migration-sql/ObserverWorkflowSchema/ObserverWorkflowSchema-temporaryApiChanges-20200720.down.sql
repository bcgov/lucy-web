-- ## Changing table: observer_workflow
-- ## Version: temporaryApiChanges
-- ## Info: Making station and location optional. Changes needed as temporary measure to accommodate problems in prod.
-- ## Modifying Existing Columns ## --

-- ## Modifying Columns station and location on table observer_workflow
ALTER TABLE observer_workflow ALTER COLUMN station SET NOT NULL;
ALTER TABLE observer_workflow ALTER COLUMN location SET NOT NULL;
-- ## --


-- ## Downgrading observer_workflow ## --