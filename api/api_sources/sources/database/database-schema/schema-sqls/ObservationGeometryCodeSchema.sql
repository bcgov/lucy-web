-- ### Creating Table: observation_geometry_code ### --

        
CREATE TABLE observation_geometry_code ();
ALTER TABLE observation_geometry_code ADD COLUMN observation_geometry_code_id SERIAL PRIMARY KEY;
ALTER TABLE observation_geometry_code ADD COLUMN observation_geometry_code VARCHAR(2) NOT NULL UNIQUE;
ALTER TABLE observation_geometry_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE observation_geometry_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE observation_geometry_code IS 'A 2 or 3 dimensional geometry used to describe the spatial extent of an observation: Point, linear corridor, transect, circle, rectangular plot, stratified grid, radio tract, GPS tract, water body outline.';
COMMENT ON COLUMN observation_geometry_code.observation_geometry_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN observation_geometry_code.observation_geometry_code IS 'Observation geometry code of the system';
COMMENT ON COLUMN observation_geometry_code.description IS 'Description of code';
COMMENT ON COLUMN observation_geometry_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE observation_geometry_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE observation_geometry_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN observation_geometry_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN observation_geometry_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE observation_geometry_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE observation_geometry_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN observation_geometry_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN observation_geometry_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: observation_geometry_code ### --
