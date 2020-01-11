-- ## Reverting table: mechanical_treatment
-- ## Version: spaceGeom
-- ## Info: None
-- ## Removing New Columns ## --
ALTER TABLE mechanical_treatment DROP COLUMN IF EXISTS space_geom_id;

-- ## Updating mechanical_treatment ## --
