-- ## Reverting table: chemical_treatment
-- ## Version: spaceGeom
-- ## Info: None
-- ## Removing New Columns ## --
ALTER TABLE chemical_treatment DROP COLUMN IF EXISTS space_geom_id;

-- ## Updating chemical_treatment ## --
