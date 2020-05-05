-- ### Creating Table: observer_workflow ### --

        
CREATE TABLE observer_workflow ();
ALTER TABLE observer_workflow ADD COLUMN observer_workflow_id SERIAL PRIMARY KEY;
ALTER TABLE observer_workflow ADD COLUMN date DATE NOT NULL;
ALTER TABLE observer_workflow ADD COLUMN start_time TIMESTAMP NULL;
ALTER TABLE observer_workflow ADD COLUMN end_time TIMESTAMP NULL;
ALTER TABLE observer_workflow ADD COLUMN station VARCHAR(100) NULL;
ALTER TABLE observer_workflow ADD COLUMN location VARCHAR(100) NULL;
ALTER TABLE observer_workflow ADD COLUMN shift_start_comment VARCHAR(300) NULL;
ALTER TABLE observer_workflow ADD COLUMN shift_end_comment VARCHAR(300) NULL;
ALTER TABLE observer_workflow ADD COLUMN motorized_blow_bys_counter INT NOT NULL DEFAULT 0;
ALTER TABLE observer_workflow ADD COLUMN non_motorized_blow_bys_counter INT NOT NULL DEFAULT 0;
ALTER TABLE observer_workflow ADD COLUMN boats_inspected_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE observer_workflow ADD COLUMN k9_on_shift_ind BOOLEAN NOT NULL DEFAULT FALSE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE observer_workflow IS 'Table to store typical work flow data for watercraft observer. Which includes start of the day form and end of the day form. This table is used to store refer from WatercraftRiskAssessment and WaterCraft quick pass schema';
COMMENT ON COLUMN observer_workflow.observer_workflow_id IS 'Auto generated primary key';
COMMENT ON COLUMN observer_workflow.date IS 'Date of the work shift';
COMMENT ON COLUMN observer_workflow.start_time IS 'Start time of workflow';
COMMENT ON COLUMN observer_workflow.end_time IS 'End time of workflow';
COMMENT ON COLUMN observer_workflow.station IS 'Station name';
COMMENT ON COLUMN observer_workflow.location IS 'Location name';
COMMENT ON COLUMN observer_workflow.shift_start_comment IS 'This column will store user comment on start of the day';
COMMENT ON COLUMN observer_workflow.shift_end_comment IS 'This column will store user comment on end of the day';
COMMENT ON COLUMN observer_workflow.motorized_blow_bys_counter IS 'Counter for number of motorized boats inspected during the shift';
COMMENT ON COLUMN observer_workflow.non_motorized_blow_bys_counter IS 'Counter for number of non motorized boats inspected during the shift';
COMMENT ON COLUMN observer_workflow.boats_inspected_ind IS 'Boolean indicator to show any boat was inspected during shift';
COMMENT ON COLUMN observer_workflow.k9_on_shift_ind IS 'Boolean indicator to show K9 on shift';


        
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
