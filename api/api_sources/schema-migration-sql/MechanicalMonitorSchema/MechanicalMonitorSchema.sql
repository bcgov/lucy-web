-- ### Creating Table: mechanical_monitor ### --

        
CREATE TABLE mechanical_monitor ();
ALTER TABLE mechanical_monitor ADD COLUMN mechanical_monitor_id SERIAL PRIMARY KEY;
ALTER TABLE mechanical_monitor ADD COLUMN observer_first_name VARCHAR(100) NULL;
ALTER TABLE mechanical_monitor ADD COLUMN observer_last_name VARCHAR(100) NULL;
ALTER TABLE mechanical_monitor ADD COLUMN mechanical_monitor_timestamp TIMESTAMP NOT NULL;
ALTER TABLE mechanical_monitor ADD COLUMN mechanical_monitor_paper_file_ref VARCHAR(100) NULL;
ALTER TABLE mechanical_monitor ADD COLUMN comments VARCHAR(500) NULL;
ALTER TABLE mechanical_monitor ADD COLUMN species_agency_code_id INT NULL REFERENCES species_agency_code(species_agency_code_id) ON DELETE SET NULL;
ALTER TABLE mechanical_monitor ADD COLUMN mechanical_treatment_id INT NULL REFERENCES mechanical_treatment(mechanical_treatment_id) ON DELETE SET NULL;
ALTER TABLE mechanical_monitor ADD COLUMN efficacy_code_id INT NULL REFERENCES efficacy_code(efficacy_code_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE mechanical_monitor IS 'A monitoring record created as follow-up to a mechanical treatment';
COMMENT ON COLUMN mechanical_monitor.mechanical_monitor_id IS 'Auto generated primary key. This is auto incremental field';
COMMENT ON COLUMN mechanical_monitor.observer_first_name IS 'First name of the observer of the mechanical monitoring record';
COMMENT ON COLUMN mechanical_monitor.observer_last_name IS 'Last name of the observer of the mechanical monitoring record';
COMMENT ON COLUMN mechanical_monitor.mechanical_monitor_timestamp IS 'Date and time of the monitoring record';
COMMENT ON COLUMN mechanical_monitor.mechanical_monitor_paper_file_ref IS 'Paper file reference associated with monitoring record';
COMMENT ON COLUMN mechanical_monitor.comments IS 'Free-form comments added by mechanical monitoring observer';
COMMENT ON COLUMN mechanical_monitor.species_agency_code_id IS 'Foreign key reference to Species Agency code table';
COMMENT ON COLUMN mechanical_monitor.mechanical_treatment_id IS 'Foreign key reference to Mechanical Treatments table';
COMMENT ON COLUMN mechanical_monitor.efficacy_code_id IS 'Foreign key reference to Efficacy code table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE mechanical_monitor ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE mechanical_monitor ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN mechanical_monitor.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN mechanical_monitor.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE mechanical_monitor ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE mechanical_monitor ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN mechanical_monitor.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN mechanical_monitor.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: mechanical_monitor ### --
