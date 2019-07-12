-- ### Creating Table: observation ### --

        
CREATE TABLE observation ();
ALTER TABLE observation ADD COLUMN observation_id SERIAL PRIMARY KEY;
ALTER TABLE observation ADD COLUMN observation_date DATE NULL;
ALTER TABLE observation ADD COLUMN observation_location_lat NUMERIC(8, 6) NOT NULL;
ALTER TABLE observation ADD COLUMN observation_location_long NUMERIC(9, 6) NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE observation IS 'Observation table';
COMMENT ON COLUMN observation.observation_id IS 'Auto generated primary key';
COMMENT ON COLUMN observation.observation_date IS 'Date of observation';
COMMENT ON COLUMN observation.observation_location_lat IS 'Date of observation';
COMMENT ON COLUMN observation.observation_location_long IS 'Date of observation';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE observation ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE observation ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN observation.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN observation.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE observation ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE observation ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN observation.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN observation.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: observation ### --
