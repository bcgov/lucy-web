-- ### Creating Table: adult_mussels_location ### --

        
CREATE TABLE adult_mussels_location ();
ALTER TABLE adult_mussels_location ADD COLUMN adult_mussels_location_id SERIAL PRIMARY KEY;
ALTER TABLE adult_mussels_location ADD COLUMN description VARCHAR(50) NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE adult_mussels_location IS 'Code table with options for locations on watercraft where adult mussels were found during inspection';
COMMENT ON COLUMN adult_mussels_location.adult_mussels_location_id IS 'Auto generated sequential primary key column.';
COMMENT ON COLUMN adult_mussels_location.description IS 'Brief description of the location on the watercraft where adult mussels were found';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE adult_mussels_location ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE adult_mussels_location ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN adult_mussels_location.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN adult_mussels_location.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE adult_mussels_location ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE adult_mussels_location ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN adult_mussels_location.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN adult_mussels_location.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: adult_mussels_location ### --
