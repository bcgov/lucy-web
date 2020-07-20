-- ## Changing table: observer_workflow
-- ## Version: temporaryApiChanges
-- ## Info: Making station and location optional. Changes needed as temporary measure to accommodate problems in prod.
-- ## Modifying Existing Columns ## --

-- ## Modifying Columns station and location on table observer_workflow
ALTER TABLE observer_workflow ALTER COLUMN station DROP NOT NULL;
ALTER TABLE observer_workflow ALTER COLUMN location DROP NOT NULL;
-- ## --


-- ## Updating observer_workflow ## --
