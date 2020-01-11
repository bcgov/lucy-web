-- ## Reverting table: observation
-- ## Version: spaceGeom
-- ## Info: None
-- ## Removing New Columns ## --
ALTER TABLE observation DROP COLUMN IF EXISTS space_geom_id;

-- ## Updating observation ## --
