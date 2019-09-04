-- ### Creating Table: mechanical_root_removal_code ### --

        
CREATE TABLE mechanical_root_removal_code ();
ALTER TABLE mechanical_root_removal_code ADD COLUMN mechanical_root_removal_code_id SERIAL PRIMARY KEY;
ALTER TABLE mechanical_root_removal_code ADD COLUMN mechanical_root_removal_code VARCHAR(6) NOT NULL UNIQUE;
ALTER TABLE mechanical_root_removal_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE mechanical_root_removal_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE mechanical_root_removal_code IS 'This table is collection of mechanical root removal code for mechanical treatment';
COMMENT ON COLUMN mechanical_root_removal_code.mechanical_root_removal_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN mechanical_root_removal_code.mechanical_root_removal_code IS 'String encoded enum values for Mechanical root system codes.';
COMMENT ON COLUMN mechanical_root_removal_code.description IS 'Description of code';
COMMENT ON COLUMN mechanical_root_removal_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE mechanical_root_removal_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE mechanical_root_removal_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN mechanical_root_removal_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN mechanical_root_removal_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE mechanical_root_removal_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE mechanical_root_removal_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN mechanical_root_removal_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN mechanical_root_removal_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: mechanical_root_removal_code ### --
