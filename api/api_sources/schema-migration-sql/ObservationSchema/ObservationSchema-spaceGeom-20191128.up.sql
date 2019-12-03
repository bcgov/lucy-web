-- ## Changing table: observation
-- ## Version: spaceGeom
-- ## Info: None
-- ## Adding New Columns ## --

-- ## Adding Column space_geom_id on table observation
ALTER TABLE observation ADD COLUMN space_geom_id INT NULL REFERENCES space_geom(space_geom_id) ON DELETE SET NULL;
COMMENT ON COLUMN observation.space_geom_id IS 'Spatial and Geometry reference data associated with record. Foreign key reference to space_geom table';
-- ## --


-- ## Updating observation ## --
