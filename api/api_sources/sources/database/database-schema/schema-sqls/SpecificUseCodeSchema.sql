-- ### Creating Table: specific_use_code ### --

        
CREATE TABLE specific_use_code ();
ALTER TABLE specific_use_code ADD COLUMN specific_use_code_id SERIAL PRIMARY KEY;
ALTER TABLE specific_use_code ADD COLUMN specific_use_code VARCHAR(2) NOT NULL UNIQUE;
ALTER TABLE specific_use_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE specific_use_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE specific_use_code IS 'Code table for schema of Specific use codes of the observation';
COMMENT ON COLUMN specific_use_code.specific_use_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN specific_use_code.specific_use_code IS 'Code values of specific use codes';
COMMENT ON COLUMN specific_use_code.description IS 'Description of code';
COMMENT ON COLUMN specific_use_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE specific_use_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE specific_use_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN specific_use_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN specific_use_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE specific_use_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE specific_use_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN specific_use_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN specific_use_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: specific_use_code ### --
