-- ## Changing table: animal_observation
-- ## Version: spaceGeom
-- ## Info: None
-- ## Adding New Columns ## --

-- ## Adding Column space_geom_id on table animal_observation
ALTER TABLE animal_observation ADD COLUMN space_geom_id INT NULL REFERENCES space_geom(space_geom_id) ON DELETE SET NULL;
COMMENT ON COLUMN animal_observation.space_geom_id IS 'Spatial and Geometry reference data associated with record. Foreign key reference to space_geom table';
-- ## --


-- ## Updating animal_observation ## --
