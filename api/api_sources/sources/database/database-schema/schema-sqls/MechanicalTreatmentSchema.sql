-- ### Creating Table: mechanical_treatment ### --

        
CREATE TABLE mechanical_treatment ();
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_treatment_id SERIAL PRIMARY KEY;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_treatment_location_latitude NUMERIC(8, 6) NOT NULL;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_treatment_location_longitude NUMERIC(9, 6) NOT NULL;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_treatment_area_width NUMERIC(7, 2) NULL DEFAULT 0.0;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_treatment_area_length NUMERIC(7, 2) NULL DEFAULT 0.0;
ALTER TABLE mechanical_treatment ADD COLUMN observation_id INT NOT NULL REFERENCES observation(observation_id) ON DELETE CASCADE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE mechanical_treatment IS 'An application of a mechanical or cultural control. Mechanical weed control employs various implements and techniques to physically disturb weeds or to interrupt their reproduction by depleting root reserves through repeated defoliation of the plant. Mechanical control includes the mowing, ploughing, chopping, and crushing of weeds. Cultural control includes selective grazing, irrigation and deliberate flooding, mulching, hand pulling, and burning. Strategies and timing should depend on the weed species and its location in the province.';
COMMENT ON COLUMN mechanical_treatment.mechanical_treatment_id IS 'Auto generated primary key';
COMMENT ON COLUMN mechanical_treatment.mechanical_treatment_location_latitude IS 'Latitude of treatment  location';
COMMENT ON COLUMN mechanical_treatment.mechanical_treatment_location_longitude IS 'Longitude of treatment location';
COMMENT ON COLUMN mechanical_treatment.mechanical_treatment_area_width IS 'Width of the area of treatment';
COMMENT ON COLUMN mechanical_treatment.mechanical_treatment_area_length IS 'Length of the area of treatment';
COMMENT ON COLUMN mechanical_treatment.observation_id IS 'Observation associated with treatment';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE mechanical_treatment ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE mechanical_treatment ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN mechanical_treatment.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN mechanical_treatment.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE mechanical_treatment ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE mechanical_treatment ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN mechanical_treatment.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN mechanical_treatment.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: mechanical_treatment ### --
