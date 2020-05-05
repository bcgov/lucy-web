-- ### Creating Table: observation_chemical_treatment ### --

        
CREATE TABLE observation_chemical_treatment ();
ALTER TABLE observation_chemical_treatment ADD COLUMN observation_chemical_treatment_id SERIAL PRIMARY KEY;
ALTER TABLE observation_chemical_treatment ADD COLUMN species_treatment_area_coverage NUMERIC(4,1) NULL;
ALTER TABLE observation_chemical_treatment ADD COLUMN observation_id INT NULL REFERENCES observation(observation_id) ON DELETE SET NULL;
ALTER TABLE observation_chemical_treatment ADD COLUMN chemical_treatment_id INT NULL REFERENCES chemical_treatment(chemical_treatment_id) ON DELETE CASCADE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE observation_chemical_treatment IS 'A record of one targeted species within the treatment area';
COMMENT ON COLUMN observation_chemical_treatment.observation_chemical_treatment_id IS 'Auto generated primary key. This is auto incremental field';
COMMENT ON COLUMN observation_chemical_treatment.species_treatment_area_coverage IS 'Percentage of treatment area covered by selected species';
COMMENT ON COLUMN observation_chemical_treatment.observation_id IS 'Foreign key reference to observation ID that records the species being treated';
COMMENT ON COLUMN observation_chemical_treatment.chemical_treatment_id IS 'Foreign key reference to parent chemical treatment table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE observation_chemical_treatment ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE observation_chemical_treatment ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN observation_chemical_treatment.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN observation_chemical_treatment.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE observation_chemical_treatment ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE observation_chemical_treatment ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN observation_chemical_treatment.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN observation_chemical_treatment.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: observation_chemical_treatment ### --
