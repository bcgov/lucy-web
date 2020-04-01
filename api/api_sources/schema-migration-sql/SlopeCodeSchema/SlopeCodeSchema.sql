-- ### Creating Table: observation_slope_code ### --

        
CREATE TABLE observation_slope_code ();
ALTER TABLE observation_slope_code ADD COLUMN observation_slope_code_id SERIAL PRIMARY KEY;
ALTER TABLE observation_slope_code ADD COLUMN observation_slope_code VARCHAR(5) NOT NULL UNIQUE;
ALTER TABLE observation_slope_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE observation_slope_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE observation_slope_code IS 'Observation area slope code. Slope code is encoded value of description . NA specified data not available and FL means flat with 0%, similarly VSTS specified very steep slop with more than 45%';
COMMENT ON COLUMN observation_slope_code.observation_slope_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN observation_slope_code.observation_slope_code IS 'Integer encoded enum values for slope code';
COMMENT ON COLUMN observation_slope_code.description IS 'Description of code';
COMMENT ON COLUMN observation_slope_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE observation_slope_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE observation_slope_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN observation_slope_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN observation_slope_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE observation_slope_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE observation_slope_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN observation_slope_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN observation_slope_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: observation_slope_code ### --
