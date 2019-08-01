-- ### Creating Table: observation_type_code ### --

        
CREATE TABLE observation_type_code ();
ALTER TABLE observation_type_code ADD COLUMN observation_type_code_id SERIAL PRIMARY KEY;
ALTER TABLE observation_type_code ADD COLUMN observation_type_code VARCHAR(5) NOT NULL UNIQUE;
ALTER TABLE observation_type_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE observation_type_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE observation_type_code IS 'The description of the observation was obtained (akin to quality): Operational, cursory, research, mobile, aerial photo, satellite imagery.';
COMMENT ON COLUMN observation_type_code.observation_type_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN observation_type_code.observation_type_code IS 'Cross domain Code values for observation type types';
COMMENT ON COLUMN observation_type_code.description IS 'Description of code';
COMMENT ON COLUMN observation_type_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE observation_type_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE observation_type_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN observation_type_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN observation_type_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE observation_type_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE observation_type_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN observation_type_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN observation_type_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: observation_type_code ### --
