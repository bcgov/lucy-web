-- ### Creating Table: water_body ### --

        
CREATE TABLE water_body ();
ALTER TABLE water_body ADD COLUMN water_body_id SERIAL PRIMARY KEY;
ALTER TABLE water_body ADD COLUMN type_enum SMALLINT NOT NULL;
ALTER TABLE water_body ADD COLUMN name VARCHAR(100) NOT NULL;
ALTER TABLE water_body ADD COLUMN type_name VARCHAR(50) NOT NULL;
ALTER TABLE water_body ADD COLUMN type_code INT NOT NULL;
ALTER TABLE water_body ADD COLUMN water_body_location_latitude NUMERIC(10, 7) NOT NULL;
ALTER TABLE water_body ADD COLUMN water_body_location_longitude NUMERIC(10, 7) NOT NULL;
ALTER TABLE water_body ADD COLUMN country VARCHAR(100) NOT NULL;
ALTER TABLE water_body ADD COLUMN province VARCHAR(100) NOT NULL;
ALTER TABLE water_body ADD COLUMN abbrev VARCHAR(50) NOT NULL;
ALTER TABLE water_body ADD COLUMN closest VARCHAR(100) NOT NULL;
ALTER TABLE water_body ADD COLUMN distance NUMERIC(10, 5);


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE water_body IS 'The table to store all lake/water body information. Watercraft observation require  information regarding its source and destination.';
COMMENT ON COLUMN water_body.water_body_id IS 'Auto generated primary key';
COMMENT ON COLUMN water_body.type_enum IS 'Type of the water-body. This type is application specific enum values';
COMMENT ON COLUMN water_body.name IS 'Common or popular name of the water-body';
COMMENT ON COLUMN water_body.type_name IS 'Type of the water-body. This type is application specific string enum values. Like lake/river';
COMMENT ON COLUMN water_body.type_code IS 'Type of the water-body. This type is application specific enum values.';
COMMENT ON COLUMN water_body.water_body_location_latitude IS 'Latitude of treatment  location';
COMMENT ON COLUMN water_body.water_body_location_longitude IS 'Longitude of treatment location';
COMMENT ON COLUMN water_body.country IS 'Country of the water-body';
COMMENT ON COLUMN water_body.province IS 'Province of the water-body location';
COMMENT ON COLUMN water_body.abbrev IS 'Abbreviation of the water state/province';
COMMENT ON COLUMN water_body.closest IS 'Closest landmark';
COMMENT ON COLUMN water_body.distance IS 'Distance from closest landmark';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE water_body ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE water_body ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN water_body.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN water_body.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE water_body ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE water_body ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN water_body.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN water_body.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: water_body ### --
