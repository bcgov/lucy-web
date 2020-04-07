-- ### Creating Table: observation ### --

        
CREATE TABLE observation ();
ALTER TABLE observation ADD COLUMN observation_id SERIAL PRIMARY KEY;
ALTER TABLE observation ADD COLUMN observation_date DATE NULL;
ALTER TABLE observation ADD COLUMN access_description VARCHAR(500) NULL;
ALTER TABLE observation ADD COLUMN observer_first_name VARCHAR(100) NULL;
ALTER TABLE observation ADD COLUMN observer_last_name VARCHAR(100) NULL;
ALTER TABLE observation ADD COLUMN sample_identifier VARCHAR(50) NULL;
ALTER TABLE observation ADD COLUMN range_unit_number VARCHAR(50) NULL;
ALTER TABLE observation ADD COLUMN general_comment VARCHAR(500) NULL;
ALTER TABLE observation ADD COLUMN legacy_site_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE observation ADD COLUMN early_detection_rapid_resp_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE observation ADD COLUMN research_detection_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE observation ADD COLUMN sample_taken_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE observation ADD COLUMN well_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE observation ADD COLUMN special_care_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE observation ADD COLUMN biological_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE observation ADD COLUMN aquatic_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE observation ADD COLUMN species_id INT NULL REFERENCES species(species_id) ON DELETE CASCADE;
ALTER TABLE observation ADD COLUMN jurisdiction_code_id INT NULL REFERENCES jurisdiction_code(jurisdiction_code_id) ON DELETE CASCADE;
ALTER TABLE observation ADD COLUMN species_density_code_id INT NULL REFERENCES species_density_code(species_density_code_id) ON DELETE SET NULL;
ALTER TABLE observation ADD COLUMN species_distribution_code_id INT NULL REFERENCES species_distribution_code(species_distribution_code_id) ON DELETE SET NULL;
ALTER TABLE observation ADD COLUMN observation_type_code_id INT NULL REFERENCES observation_type_code(observation_type_code_id) ON DELETE SET NULL;
ALTER TABLE observation ADD COLUMN species_agency_code_id INT NULL REFERENCES species_agency_code(species_agency_code_id) ON DELETE SET NULL;
ALTER TABLE observation ADD COLUMN soil_texture_code_id INT NULL REFERENCES soil_texture_code(soil_texture_code_id) ON DELETE SET NULL;
ALTER TABLE observation ADD COLUMN specific_use_code_id INT NULL REFERENCES specific_use_code(specific_use_code_id) ON DELETE SET NULL;
ALTER TABLE observation ADD COLUMN observation_slope_code_id INT NULL REFERENCES observation_slope_code(observation_slope_code_id) ON DELETE SET NULL;
ALTER TABLE observation ADD COLUMN observation_aspect_code_id INT NULL REFERENCES observation_aspect_code(observation_aspect_code_id) ON DELETE SET NULL;
ALTER TABLE observation ADD COLUMN observation_proposed_action_code_id INT NULL REFERENCES observation_proposed_action_code(observation_proposed_action_code_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE observation IS 'An observation describing the nature and extent of the species on the landscape. It may be collected by 1) an individual (a scientist or citizen) at the location, 2) a digital tracking device (airborne or ground based), or 3) an inferred analysis based on surrounding data.  An observation location provides an historical record of all surveys done regarding a particular species of invasive plant on the site. Provides a chronological recording of the change in distribution and density of invasive plants on the site. An area with confirmed ground sightings of invasive alien plants. This may be terrestrial (invasive plants on the ground) or aquatic (invasive plants in lakes, streams or other water-bodies). Within this inventory area, all roads accessible by a four-wheel drive vehicle that cross potential habitat will be checked for occurrences of invasive plants. Plants on both sides of the road will be identified as far as can be seen from the road, or as defined for specific inventory projects. In addition, all major disturbances including but not limited to landings, log sort yards, burned areas, gravel pits, air strips, landfills, parking lots, construction or maintenance sites and recreational sites and trails within the potential habitat will be checked.';
COMMENT ON COLUMN observation.observation_id IS 'Auto generated primary key';
COMMENT ON COLUMN observation.observation_date IS 'The Observation Date is the date that the invasive species occurrence was observed by the submitter.';
COMMENT ON COLUMN observation.access_description IS 'Note to specify how to access the location';
COMMENT ON COLUMN observation.observer_first_name IS 'First name of the observer of the observation';
COMMENT ON COLUMN observation.observer_last_name IS 'Last name of the observer of the observation';
COMMENT ON COLUMN observation.sample_identifier IS 'Identifier for sample taken.';
COMMENT ON COLUMN observation.range_unit_number IS 'Identifier/Number of range unit associated with observation.';
COMMENT ON COLUMN observation.general_comment IS 'General comment associated with observation';
COMMENT ON COLUMN observation.legacy_site_ind IS 'This indicator used to indicate the observation site is legacy site or not.';
COMMENT ON COLUMN observation.early_detection_rapid_resp_ind IS 'Indicator for early detection and rapid response for observed species.';
COMMENT ON COLUMN observation.research_detection_ind IS 'Values of this column indicates this observation is research purpose or not.';
COMMENT ON COLUMN observation.sample_taken_ind IS 'This field specify any sample is taken from observed area, if this indicator is true, observer must specify sample id.';
COMMENT ON COLUMN observation.well_ind IS 'This field indicates well proximity of the observed location. If this indicator is true, observer should specify well proximity values and API will connect to GWELL service to fetch more information';
COMMENT ON COLUMN observation.special_care_ind IS 'This field indicates, the requirement of special care.';
COMMENT ON COLUMN observation.biological_ind IS 'This field indicates, observation is biological or not.';
COMMENT ON COLUMN observation.aquatic_ind IS 'This field indicates, observation is for aquatic element or not.';
COMMENT ON COLUMN observation.species_id IS 'Foreign key reference to species table';
COMMENT ON COLUMN observation.jurisdiction_code_id IS 'Foreign key reference to Jurisdiction code table';
COMMENT ON COLUMN observation.species_density_code_id IS 'Foreign key reference to species density code table';
COMMENT ON COLUMN observation.species_distribution_code_id IS 'Foreign key reference to observation table';
COMMENT ON COLUMN observation.observation_type_code_id IS 'Foreign key reference to observation type code table';
COMMENT ON COLUMN observation.species_agency_code_id IS 'Foreign key reference to Species Agency code table';
COMMENT ON COLUMN observation.soil_texture_code_id IS 'Foreign key reference to Soil Texture code table';
COMMENT ON COLUMN observation.specific_use_code_id IS 'Foreign key reference to Specific use code table';
COMMENT ON COLUMN observation.observation_slope_code_id IS 'Foreign key reference to observation slope code table';
COMMENT ON COLUMN observation.observation_aspect_code_id IS 'Foreign key reference to observation directional aspect code table';
COMMENT ON COLUMN observation.observation_proposed_action_code_id IS 'Foreign key reference to observation proposed action codes';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE observation ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE observation ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN observation.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN observation.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE observation ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE observation ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN observation.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN observation.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: observation ### --
