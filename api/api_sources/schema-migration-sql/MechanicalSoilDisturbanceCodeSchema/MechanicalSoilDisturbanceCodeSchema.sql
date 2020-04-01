-- ### Creating Table: mechanical_soil_disturbance_code ### --

        
CREATE TABLE mechanical_soil_disturbance_code ();
ALTER TABLE mechanical_soil_disturbance_code ADD COLUMN mechanical_soil_disturbance_code_id SERIAL PRIMARY KEY;
ALTER TABLE mechanical_soil_disturbance_code ADD COLUMN mechanical_soil_disturbance_code VARCHAR(6) NOT NULL UNIQUE;
ALTER TABLE mechanical_soil_disturbance_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE mechanical_soil_disturbance_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE mechanical_soil_disturbance_code IS 'This table is collection of soil disturbance code for mechanical treatment';
COMMENT ON COLUMN mechanical_soil_disturbance_code.mechanical_soil_disturbance_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN mechanical_soil_disturbance_code.mechanical_soil_disturbance_code IS 'String encoded enum values for Mechanical Soil disturbance codes.';
COMMENT ON COLUMN mechanical_soil_disturbance_code.description IS 'Description of code';
COMMENT ON COLUMN mechanical_soil_disturbance_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE mechanical_soil_disturbance_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE mechanical_soil_disturbance_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN mechanical_soil_disturbance_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN mechanical_soil_disturbance_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE mechanical_soil_disturbance_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE mechanical_soil_disturbance_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN mechanical_soil_disturbance_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN mechanical_soil_disturbance_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: mechanical_soil_disturbance_code ### --
