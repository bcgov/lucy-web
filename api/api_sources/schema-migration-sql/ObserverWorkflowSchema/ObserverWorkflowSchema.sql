-- ### Creating Table: observer_workflow ### --

        
CREATE TABLE observer_workflow ();
ALTER TABLE observer_workflow ADD COLUMN observer_workflow_id SERIAL PRIMARY KEY;
ALTER TABLE observer_workflow ADD COLUMN date DATE NOT NULL;
ALTER TABLE observer_workflow ADD COLUMN start_of_day_form JSONB NULL;
ALTER TABLE observer_workflow ADD COLUMN end_of_day_form JSONB NULL;
ALTER TABLE observer_workflow ADD COLUMN info JSONB NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE observer_workflow IS 'Table to store typical work flow data for watercraft observer. Which includes start of the day form and end of the day form. This table is used to store refer from WatercraftRiskAssessment and WaterCraftPassport schema';
COMMENT ON COLUMN observer_workflow.observer_workflow_id IS 'Auto generated primary key';
COMMENT ON COLUMN observer_workflow.date IS 'Date of the work shift';
COMMENT ON COLUMN observer_workflow.start_of_day_form IS 'JSON column to store all start of day variables';
COMMENT ON COLUMN observer_workflow.end_of_day_form IS 'JSON column to store all end of day variables';
COMMENT ON COLUMN observer_workflow.info IS 'Any additional info to store for workflow';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE observer_workflow ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE observer_workflow ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN observer_workflow.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN observer_workflow.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE observer_workflow ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE observer_workflow ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN observer_workflow.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN observer_workflow.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: observer_workflow ### --
