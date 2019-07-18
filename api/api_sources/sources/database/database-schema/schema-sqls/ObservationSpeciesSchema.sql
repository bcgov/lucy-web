-- ### Creating Table: observation_species ### --

        
CREATE TABLE observation_species ();
ALTER TABLE observation_species ADD COLUMN observation_species_id SERIAL PRIMARY KEY;
ALTER TABLE observation_species ADD COLUMN area_width NUMERIC(7, 2) NULL DEFAULT 0.0;
ALTER TABLE observation_species ADD COLUMN area_length NUMERIC(7, 2) NULL DEFAULT 0.0;
ALTER TABLE observation_species ADD COLUMN access_description VARCHAR(500) NULL;
ALTER TABLE observation_species ADD COLUMN species_id INT NULL REFERENCES species(species_id) ON DELETE CASCADE;
ALTER TABLE observation_species ADD COLUMN jurisdiction_code_id INT NULL REFERENCES jurisdiction_code(jurisdiction_code_id) ON DELETE CASCADE;
ALTER TABLE observation_species ADD COLUMN observation_id INT NULL REFERENCES observation(observation_id) ON DELETE CASCADE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE observation_species IS 'This table store observation data for particular species';
COMMENT ON COLUMN observation_species.observation_species_id IS 'Auto generated primary key';
COMMENT ON COLUMN observation_species.area_width IS 'Width of the area observed';
COMMENT ON COLUMN observation_species.area_length IS 'Length of the area observed';
COMMENT ON COLUMN observation_species.access_description IS 'Note to specify how to access the location';
COMMENT ON COLUMN observation_species.species_id IS 'Foreign key reference to species table';
COMMENT ON COLUMN observation_species.jurisdiction_code_id IS 'Foreign key reference to Jurisdiction code table';
COMMENT ON COLUMN observation_species.observation_id IS 'Foreign key reference to observation table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE observation_species ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE observation_species ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN observation_species.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN observation_species.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE observation_species ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE observation_species ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN observation_species.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN observation_species.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: observation_species ### --
