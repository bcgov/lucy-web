-- ### Creating Table: mechanical_treatment_observation ### --

        
CREATE TABLE mechanical_treatment_observation ();
ALTER TABLE mechanical_treatment_observation ADD COLUMN mechanical_treatment_observation_id SERIAL PRIMARY KEY;
ALTER TABLE mechanical_treatment_observation ADD COLUMN observation_id INT NOT NULL REFERENCES observation(observation_id) ON DELETE CASCADE;
ALTER TABLE mechanical_treatment_observation ADD COLUMN mechanical_treatment_id INT NOT NULL REFERENCES mechanical_treatment(mechanical_treatment_id) ON DELETE CASCADE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE mechanical_treatment_observation IS 'Joining table for mechanical treatment and observation';
COMMENT ON COLUMN mechanical_treatment_observation.mechanical_treatment_observation_id IS 'Auto generated sequential primary key column.';
COMMENT ON COLUMN mechanical_treatment_observation.observation_id IS 'Foreign key reference to observation table';
COMMENT ON COLUMN mechanical_treatment_observation.mechanical_treatment_id IS 'Foreign key reference to mechanical treatment table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE mechanical_treatment_observation ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE mechanical_treatment_observation ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN mechanical_treatment_observation.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN mechanical_treatment_observation.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        

 -- ### End: mechanical_treatment_observation ### --
