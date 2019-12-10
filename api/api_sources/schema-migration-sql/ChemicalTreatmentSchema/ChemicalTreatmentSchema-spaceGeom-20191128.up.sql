-- ## Changing table: chemical_treatment
-- ## Version: spaceGeom
-- ## Info: None
-- ## Adding New Columns ## --

-- ## Adding Column space_geom_id on table chemical_treatment
ALTER TABLE chemical_treatment ADD COLUMN space_geom_id INT NULL REFERENCES space_geom(space_geom_id) ON DELETE SET NULL;
COMMENT ON COLUMN chemical_treatment.space_geom_id IS 'Spatial and Geometry reference data associated with record. Foreign key reference to space_geom table';
-- ## --


-- ## Updating chemical_treatment ## --
