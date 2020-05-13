-- ## Reverting table: animal_observation
-- ## Version: spaceGeom
-- ## Info: None
-- ## Removing New Columns ## --
ALTER TABLE animal_observation DROP COLUMN IF EXISTS space_geom_id;

-- ## Updating animal_observation ## --
