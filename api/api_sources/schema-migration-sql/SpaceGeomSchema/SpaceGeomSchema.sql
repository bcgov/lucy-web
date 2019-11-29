-- ### Creating Table: space_geom ### --

        
CREATE TABLE space_geom ();
ALTER TABLE space_geom ADD COLUMN space_geom_id SERIAL PRIMARY KEY;
ALTER TABLE space_geom ADD COLUMN latitude NUMERIC(9, 6) NOT NULL;
ALTER TABLE space_geom ADD COLUMN longitude NUMERIC(9, 6) NOT NULL;
ALTER TABLE space_geom ADD COLUMN hex_id VARCHAR(50) NULL;
ALTER TABLE space_geom ADD COLUMN sub_hex_id VARCHAR(50) NULL;
ALTER TABLE space_geom ADD COLUMN input_geometry JSONB;
ALTER TABLE space_geom ADD COLUMN meta_data VARCHAR(99) NULL;
ALTER TABLE space_geom ADD COLUMN observation_geometry_code_id INT NULL REFERENCES observation_geometry_code(observation_geometry_code_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE space_geom IS 'Table to store raw spatial data for any spatial record like Observation, Treatments, Monitoring.';
COMMENT ON COLUMN space_geom.space_geom_id IS 'Auto generated sequential primary key column.';
COMMENT ON COLUMN space_geom.latitude IS 'Latitude of treatment  location';
COMMENT ON COLUMN space_geom.longitude IS 'Longitude of treatment location.';
COMMENT ON COLUMN space_geom.hex_id IS 'Spatial methodology to store and stratify spatial data to a 1 hectare standardized provincial hexagonally shaped grid system.';
COMMENT ON COLUMN space_geom.sub_hex_id IS 'Unique spatial sub hex id to identify record location within a hex.';
COMMENT ON COLUMN space_geom.input_geometry IS 'Input Geometry geometry of the spatial record as GeoJSON format';
COMMENT ON COLUMN space_geom.meta_data IS 'Application level meta data to identify associated spatial object';
COMMENT ON COLUMN space_geom.observation_geometry_code_id IS 'Foreign key reference to observation geometry code table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE space_geom ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE space_geom ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN space_geom.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN space_geom.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE space_geom ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE space_geom ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN space_geom.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN space_geom.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: space_geom ### --
