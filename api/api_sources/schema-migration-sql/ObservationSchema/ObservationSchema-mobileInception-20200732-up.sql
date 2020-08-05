-- ## Changing table: observation
-- ## Version: mobileInception
-- ## Info: None
-- ## Adding New Columns ## --

/*select *
from observation
order by observation_id desc
limit 1;*/

/*select *
from observation_geometry_code
limit 1;*/

-- ## Adding Column hex_id on table observation
ALTER TABLE observation ADD COLUMN hex_id BIGINT NULL;
COMMENT ON COLUMN observation.hex_id IS 'Calculated from the geometry (albers)';
-- ## --

-- ## Adding Column hex_sub_id on table observation
ALTER TABLE observation ADD COLUMN hex_sub_id BIGINT NULL;
COMMENT ON COLUMN observation.hex_sub_id IS 'Calculated from the geometry (albers)';
-- ## --

-- ## Adding Column total_area on table observation
ALTER TABLE observation ADD COLUMN total_area DOUBLE PRECISION NULL;
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

-- ## Adding Column bec_zone on table observation
ALTER TABLE observation ADD COLUMN bec_zone VARCHAR(30) NULL;
COMMENT ON COLUMN observation.bec_zone IS 'Look up from BC warehouse layer';
-- ## --

-- ## Adding Column riso on table observation
ALTER TABLE observation ADD COLUMN riso VARCHAR(30) NULL;
COMMENT ON COLUMN observation.riso IS 'Look up from BC warehouse layer';
-- ## --

-- ## Adding Column ipma on table observation
ALTER TABLE observation ADD COLUMN ipma VARCHAR(30) NULL;
COMMENT ON COLUMN observation.ipma IS 'Look up from BC warehouse layer';
-- ## --

-- ## Adding Column ownership on table observation
ALTER TABLE observation ADD COLUMN ownership VARCHAR(30) NULL;
COMMENT ON COLUMN observation.ownership IS 'Look up from BC warehouse layer';
-- ## --

-- ## Adding Column regional_district on table observation
ALTER TABLE observation ADD COLUMN regional_district VARCHAR(30) NULL;
COMMENT ON COLUMN observation.regional_district IS 'Look up from BC warehouse layer';
-- ## --

-- ## Adding Column flnro_district on table observation
ALTER TABLE observation ADD COLUMN flnro_district VARCHAR(30) NULL;
COMMENT ON COLUMN observation.flnro_district IS 'Look up from BC warehouse layer';
-- ## --

-- ## Adding Column moti_district on table observation
ALTER TABLE observation ADD COLUMN moti_district VARCHAR(30) NULL;
COMMENT ON COLUMN observation.moti_district IS 'Look up from BC warehouse layer';
-- ## --


-------------------------------- Geometry columns ------------------------------------

-- ## Adding Column raw_longitude on table observation
ALTER TABLE observation ADD COLUMN raw_longitude DOUBLE PRECISION NULL;
COMMENT ON COLUMN observation.raw_longitude IS 'Calculated from the geometry (square meters)';
-- ## --

-- ## Adding Column raw_latitude on table observation
ALTER TABLE observation ADD COLUMN raw_latitude DOUBLE PRECISION NULL;
COMMENT ON COLUMN observation.raw_latitude IS 'Calculated from the geometry (square meters)';
-- ## --

-- ## Adding Column raw_utm_zone on table observation
ALTER TABLE observation ADD COLUMN raw_utm_zone INTEGER NULL;
COMMENT ON COLUMN observation.raw_utm_zone IS 'Calculated from the geometry (square meters)';
-- ## --

-- ## Adding Column raw_utm_easting on table observation
ALTER TABLE observation ADD COLUMN raw_utm_easting DOUBLE PRECISION NULL;
COMMENT ON COLUMN observation.raw_utm_easting IS 'Calculated from the geometry (square meters)';
-- ## --

-- ## Adding Column raw_utm_northing on table observation
ALTER TABLE observation ADD COLUMN raw_utm_northing DOUBLE PRECISION NULL;
COMMENT ON COLUMN observation.raw_utm_northing IS 'Calculated from the geometry (square meters)';
-- ## --

-- ## Adding Column raw_albers_x on table observation
ALTER TABLE observation ADD COLUMN raw_albers_x DOUBLE PRECISION NULL;
COMMENT ON COLUMN observation.raw_albers_x IS 'Calculated from the geometry (square meters)';
-- ## --

-- ## Adding Column raw_albers_y on table observation
ALTER TABLE observation ADD COLUMN raw_albers_y DOUBLE PRECISION NULL;
COMMENT ON COLUMN observation.raw_albers_y IS 'Calculated from the geometry (square meters)';
-- ## --

-- ## Updating observation ## --
