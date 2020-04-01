-- ## Reverting table: chemical_treatment
-- ## Version: codes
-- ## Info: Adding chemical treatment method and wind direction speed code tables reference to chemical treatment
-- ## Removing New Columns ## --
ALTER TABLE chemical_treatment DROP COLUMN IF EXISTS wind_direction_code_id;
ALTER TABLE chemical_treatment DROP COLUMN IF EXISTS chemical_treatment_method_id;

-- ## Updating chemical_treatment ## --
