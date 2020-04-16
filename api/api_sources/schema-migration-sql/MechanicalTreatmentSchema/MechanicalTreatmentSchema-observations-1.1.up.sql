-- ## Changing table: mechanical_treatment
-- ## Version: observations
-- ## Info: Schema changes to support many-to-many relation with observation table
-- ## Adding New Columns ## --

-- ## Updating mechanical_treatment ## --

-- ## Dropping Column observation_id on table mechanical_treatment --
ALTER TABLE mechanical_treatment DROP COLUMN IF EXISTS observation_id;
-- ## --

-- ## Dropping Column species_id on table mechanical_treatment --
ALTER TABLE mechanical_treatment DROP COLUMN IF EXISTS species_id;
-- ## --
