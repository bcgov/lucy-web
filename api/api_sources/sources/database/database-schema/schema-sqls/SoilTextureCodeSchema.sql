-- ### Creating Table: soil_texture_code ### --

        
CREATE TABLE soil_texture_code ();
ALTER TABLE soil_texture_code ADD COLUMN soil_texture_code_id SERIAL PRIMARY KEY;
ALTER TABLE soil_texture_code ADD COLUMN soil_texture_code VARCHAR(1) NOT NULL UNIQUE;
ALTER TABLE soil_texture_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE soil_texture_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE soil_texture_code IS 'Code table for schema of soil texture codes';
COMMENT ON COLUMN soil_texture_code.soil_texture_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN soil_texture_code.soil_texture_code IS 'Soil texture code values in the system';
COMMENT ON COLUMN soil_texture_code.description IS 'Description of code';
COMMENT ON COLUMN soil_texture_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE soil_texture_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE soil_texture_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN soil_texture_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN soil_texture_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE soil_texture_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE soil_texture_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN soil_texture_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN soil_texture_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: soil_texture_code ### --
