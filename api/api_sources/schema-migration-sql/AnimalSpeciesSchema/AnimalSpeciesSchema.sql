-- ### Creating Table: animal_species ### --

        
CREATE TABLE animal_species ();
ALTER TABLE animal_species ADD COLUMN animal_species_id SERIAL PRIMARY KEY;
ALTER TABLE animal_species ADD COLUMN common_name VARCHAR(100) NOT NULL;
ALTER TABLE animal_species ADD COLUMN scientific_name VARCHAR(100) NOT NULL;
ALTER TABLE animal_species ADD COLUMN species_class VARCHAR(100) NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE animal_species IS 'The list of all the animal species';
COMMENT ON COLUMN animal_species.animal_species_id IS 'Auto generated primary key';
COMMENT ON COLUMN animal_species.common_name IS 'Common or popular name of the species';
COMMENT ON COLUMN animal_species.scientific_name IS 'Scientific name of the species';
COMMENT ON COLUMN animal_species.species_class IS 'The class that the species belongs to';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE animal_species ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE animal_species ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN animal_species.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN animal_species.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE animal_species ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE animal_species ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN animal_species.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN animal_species.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: animal_species ### --
