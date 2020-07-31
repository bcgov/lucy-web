-- ## Changing table: observation
-- ## Version: wackyPenguin
-- ## Info: None
-- ## Adding New Columns ## --

-- ## Adding Column total_area on table observation
ALTER TABLE observation ADD COLUMN total_area INT NULL;
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


-- ## Updating observation ## --
