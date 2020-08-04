-- ## Changing table: observation
-- ## Version: wackyPenguin
-- ## Info: None
-- ## Adding New Columns ## --

-- ## Adding Column hex_id on table observation
ALTER TABLE observation ADD COLUMN hex_id BIGINT NULL;
COMMENT ON COLUMN observation.hex_id IS 'Calculated from the geometry (albers)';
-- ## --

-- ## Adding Column hex_sub_id on table observation
ALTER TABLE observation ADD COLUMN hex_sub_id BIGINT NULL;
COMMENT ON COLUMN observation.hex_sub_id IS 'Calculated from the geometry (albers)';
-- ## --

-- ## Adding Column total_area on table observation
ALTER TABLE observation ADD COLUMN total_area INTEGER NULL;
COMMENT ON COLUMN observation.total_area IS 'Calculated from the geometry (square meters)';
-- ## --

-- ## Adding Column negative_occurance_id on table observation
ALTER TABLE observation ADD COLUMN negative_occurance_id BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN observation.negative_occurance_id IS 'The observation is for absence of the species';
-- ## --

-- ## Adding Column paper_id_primary on table observation
ALTER TABLE observation ADD COLUMN paper_id_primary VARCHAR(50) NULL;
COMMENT ON COLUMN observation.paper_id_primary IS 'General user identifier';
-- ## --

-- ## Adding Column paper_id_secondary on table observation
ALTER TABLE observation ADD COLUMN paper_id_secondary VARCHAR(50) NULL;
COMMENT ON COLUMN observation.paper_id_secondary IS 'General user identifier';
-- ## --

-- ## Adding Column elevation_metes on table observation
ALTER TABLE observation ADD COLUMN elevation_metes INTEGER NULL;
COMMENT ON COLUMN observation.elevation_metes IS 'Look up from BC Warehouse layer (metres)';
-- ## --

-- ## Adding Column well_proximity on table observation
ALTER TABLE observation ADD COLUMN well_proximity INTEGER NULL;
COMMENT ON COLUMN observation.well_proximity IS 'Calculated from proximity measer (metres)';
-- ## --

-- ## Adding Column well_tag on table observation
ALTER TABLE observation ADD COLUMN well_tag INTEGER NULL;
COMMENT ON COLUMN observation.well_tag IS 'Look up from BC warehouse layer';
-- ## --

-- ## Adding Column observation_geometry_code_id on table observation
ALTER TABLE observation ADD COLUMN observation_geometry_code_id INTEGER NULL
  REFERENCES observation_geometry_code(observation_geometry_code_id)
  ON DELETE SET NULL;
COMMENT ON COLUMN observation.observation_geometry_code_id IS 'Foreign key reference to observation geometry table';
-- ## --

-- ## Adding Column photo_indicator on table observation
ALTER TABLE observation ADD COLUMN photo_indicator BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN observation.photo_indicator IS 'Indicates a photo was captured';
-- ## --

-- ## Adding Column flowering on table observation
ALTER TABLE observation ADD COLUMN flowering BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN observation.flowering IS 'Indicates the plant is flowering';
-- ## --


-- ## Updating observation ## --
