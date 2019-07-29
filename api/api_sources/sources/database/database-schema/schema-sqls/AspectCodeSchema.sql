-- ### Creating Table: observation_aspect_code ### --

        
CREATE TABLE observation_aspect_code ();
ALTER TABLE observation_aspect_code ADD COLUMN observation_aspect_code_id SERIAL PRIMARY KEY;
ALTER TABLE observation_aspect_code ADD COLUMN observation_aspect_code VARCHAR(3) NOT NULL UNIQUE;
ALTER TABLE observation_aspect_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE observation_aspect_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE observation_aspect_code IS 'Observation area aspect code. Aspect code provides integer enum encoded values for directional aspect of the observed species. The typical values like North facing or south facing';
COMMENT ON COLUMN observation_aspect_code.observation_aspect_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN observation_aspect_code.observation_aspect_code IS 'String encoded enum values for observation aspect code';
COMMENT ON COLUMN observation_aspect_code.description IS 'Description of code';
COMMENT ON COLUMN observation_aspect_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE observation_aspect_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE observation_aspect_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN observation_aspect_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN observation_aspect_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE observation_aspect_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE observation_aspect_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN observation_aspect_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN observation_aspect_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: observation_aspect_code ### --
