-- ### Creating Table: behaviour_code ### --

        
CREATE TABLE behaviour_code ();
ALTER TABLE behaviour_code ADD COLUMN behaviour_code_id SERIAL PRIMARY KEY;
ALTER TABLE behaviour_code ADD COLUMN behaviour_code VARCHAR(10) NOT NULL UNIQUE;
ALTER TABLE behaviour_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE behaviour_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE behaviour_code IS 'This is a list of all the different behaviours for a species';
COMMENT ON COLUMN behaviour_code.behaviour_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN behaviour_code.behaviour_code IS 'Code value for the behaviours';
COMMENT ON COLUMN behaviour_code.description IS 'Description of code';
COMMENT ON COLUMN behaviour_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE behaviour_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE behaviour_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN behaviour_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN behaviour_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE behaviour_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE behaviour_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN behaviour_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN behaviour_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: behaviour_code ### --
