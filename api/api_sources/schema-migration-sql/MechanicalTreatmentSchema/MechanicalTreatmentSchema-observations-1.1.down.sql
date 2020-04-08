-- ## Reverting table: mechanical_treatment
-- ## Version: observations
-- ## Info: Schema changes to support many-to-many relation with observation table
-- ## Removing New Columns ## --

-- ## Updating mechanical_treatment ## --
-- ## Reverting changes --
-- ## Down Migration: Adding column back --

-- ## Adding Column observation_id on table mechanical_treatment
ALTER TABLE mechanical_treatment ADD COLUMN observation_id INT NOT NULL REFERENCES observation(observation_id) ON DELETE CASCADE;
COMMENT ON COLUMN mechanical_treatment.observation_id IS 'Observation associated with treatment';
-- ## --
