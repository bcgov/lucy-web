-- ### Creating Table: session_activity_code ### --

        
CREATE TABLE session_activity_code ();
ALTER TABLE session_activity_code ADD COLUMN session_activity_code_id SERIAL PRIMARY KEY;
ALTER TABLE session_activity_code ADD COLUMN session_activity_code VARCHAR(10) NOT NULL UNIQUE;
ALTER TABLE session_activity_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE session_activity_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE session_activity_code IS 'Code table to hold various session activities, like Date Add (DA), Data edit (DE), Date Delete (DD), Reporting (RP), Other Activities (OTHER)';
COMMENT ON COLUMN session_activity_code.session_activity_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN session_activity_code.session_activity_code IS 'Unique activity code for session';
COMMENT ON COLUMN session_activity_code.description IS 'Description of code';
COMMENT ON COLUMN session_activity_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE session_activity_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE session_activity_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN session_activity_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN session_activity_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE session_activity_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE session_activity_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN session_activity_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN session_activity_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: session_activity_code ### --
