-- ### Creating Table: water_body ### --

        
CREATE TABLE water_body ();
ALTER TABLE water_body ADD COLUMN water_body_id SERIAL PRIMARY KEY;
ALTER TABLE water_body ADD COLUMN water_body_name VARCHAR(100) NOT NULL;
ALTER TABLE water_body ADD COLUMN water_body_latitude NUMERIC(10, 7) NOT NULL;
ALTER TABLE water_body ADD COLUMN water_body_longitude NUMERIC(10, 7) NOT NULL;
ALTER TABLE water_body ADD COLUMN country_code VARCHAR(3) NULL;
ALTER TABLE water_body ADD COLUMN province_code VARCHAR(2) NULL;
ALTER TABLE water_body ADD COLUMN closest_city VARCHAR(100) NOT NULL;
ALTER TABLE water_body ADD COLUMN distance NUMERIC(10, 5);
ALTER TABLE water_body ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE water_body IS 'The table to store all lake/water body information. Watercraft observation require  information regarding its source and destination.';
COMMENT ON COLUMN water_body.water_body_id IS 'Auto generated primary key';
COMMENT ON COLUMN water_body.water_body_name IS 'Common or popular name of the water-body';
COMMENT ON COLUMN water_body.water_body_latitude IS 'Latitude of water body location';
COMMENT ON COLUMN water_body.water_body_longitude IS 'Longitude of water body location';
COMMENT ON COLUMN water_body.country_code IS 'Country of the water-body location. Joint foreign key reference to country_province table country_code column along with province_code.';
COMMENT ON COLUMN water_body.province_code IS 'Province of the water-body location. Joint foreign key reference to country_province table province_code column along with country code.';
COMMENT ON COLUMN water_body.closest_city IS 'Nearest city/landmark from the water body';
COMMENT ON COLUMN water_body.distance IS 'Distance from closest city/landmark in kilometer';
COMMENT ON COLUMN water_body.active_ind IS 'Boolean flag to check, the record is active or not.';


        
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
