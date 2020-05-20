-- ### Creating Table: animal_observation ### --

        
CREATE TABLE animal_observation ();
ALTER TABLE animal_observation ADD COLUMN animal_observation_id SERIAL PRIMARY KEY;
ALTER TABLE animal_observation ADD COLUMN observation_timestamp TIMESTAMP NOT NULL;
ALTER TABLE animal_observation ADD COLUMN observer_first_name VARCHAR(100) NULL;
ALTER TABLE animal_observation ADD COLUMN observer_last_name VARCHAR(100) NULL;
ALTER TABLE animal_observation ADD COLUMN number_of_individuals INT NOT NULL;
ALTER TABLE animal_observation ADD COLUMN comments VARCHAR(500) NULL;
ALTER TABLE animal_observation ADD COLUMN specimen_available_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE animal_observation ADD COLUMN animal_species_id INT NULL REFERENCES animal_species(animal_species_id) ON DELETE CASCADE;
ALTER TABLE animal_observation ADD COLUMN species_agency_code_id INT NULL REFERENCES species_agency_code(species_agency_code_id) ON DELETE SET NULL;
ALTER TABLE animal_observation ADD COLUMN life_stage_code_id INT NULL REFERENCES life_stage_code(life_stage_code_id) ON DELETE CASCADE;
ALTER TABLE animal_observation ADD COLUMN behaviour_code_id INT NULL REFERENCES behaviour_code(behaviour_code_id) ON DELETE CASCADE;
ALTER TABLE animal_observation ADD COLUMN space_geom_id INT NULL REFERENCES space_geom(space_geom_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE animal_observation IS 'An observation record created for an animal species';
COMMENT ON COLUMN animal_observation.animal_observation_id IS 'Auto generated sequential primary key column.';
COMMENT ON COLUMN animal_observation.observation_timestamp IS 'Date and time of the observation record';
COMMENT ON COLUMN animal_observation.observer_first_name IS 'First name of the observer';
COMMENT ON COLUMN animal_observation.observer_last_name IS 'Last name of the observer';
COMMENT ON COLUMN animal_observation.number_of_individuals IS 'The count of observers';
COMMENT ON COLUMN animal_observation.comments IS 'Free-form comments added by the observer';
COMMENT ON COLUMN animal_observation.specimen_available_ind IS 'This is an indicator used to indicate whether the specimen is available or not.';
COMMENT ON COLUMN animal_observation.animal_species_id IS 'Foreign key reference to animal species table';
COMMENT ON COLUMN animal_observation.species_agency_code_id IS 'Foreign key reference to Species Agency code table';
COMMENT ON COLUMN animal_observation.life_stage_code_id IS 'Foreign key reference to Life stage code table';
COMMENT ON COLUMN animal_observation.behaviour_code_id IS 'Foreign key reference to Behaviour code table';
COMMENT ON COLUMN animal_observation.space_geom_id IS 'Spatial and Geometry reference data associated with record. Foreign key reference to space_geom table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE animal_observation ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE animal_observation ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN animal_observation.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN animal_observation.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE animal_observation ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE animal_observation ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN animal_observation.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN animal_observation.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: animal_observation ### --
