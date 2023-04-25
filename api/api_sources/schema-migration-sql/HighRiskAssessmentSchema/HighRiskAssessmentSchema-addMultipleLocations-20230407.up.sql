-- ## Changing table: high_risk_assessment
-- ## Version: addMultipleLocations
-- ## Info: Adding addMultipleLocations
-- ## Adding New Columns ## --

-- ## Adding Column standing_water_location_code_id_1 on table high_risk_assessment
ALTER TABLE high_risk_assessment ADD COLUMN standing_water_location_code_id_1 INT NULL REFERENCES adult_mussels_location_code(adult_mussels_location_code_id) ON DELETE SET NULL;
COMMENT ON COLUMN high_risk_assessment.standing_water_location_code_id_1 IS 'Foreign key reference to code table (named adult_mussels_location_code) of possible locations on watercraft where standing water or adult mussels may be found. This field is specifically for locations of standing water';
-- ## --


-- ## Adding Column standing_water_location_code_id_2 on table high_risk_assessment
ALTER TABLE high_risk_assessment ADD COLUMN standing_water_location_code_id_2 INT NULL REFERENCES adult_mussels_location_code(adult_mussels_location_code_id) ON DELETE SET NULL;
COMMENT ON COLUMN high_risk_assessment.standing_water_location_code_id_2 IS 'Foreign key reference to code table (named adult_mussels_location_code) of possible locations on watercraft where standing water or adult mussels may be found. This field is specifically for locations of standing water';
-- ## --


-- ## Adding Column standing_water_location_code_id_3 on table high_risk_assessment
ALTER TABLE high_risk_assessment ADD COLUMN standing_water_location_code_id_3 INT NULL REFERENCES adult_mussels_location_code(adult_mussels_location_code_id) ON DELETE SET NULL;
COMMENT ON COLUMN high_risk_assessment.standing_water_location_code_id_3 IS 'Foreign key reference to code table (named adult_mussels_location_code) of possible locations on watercraft where standing water or adult mussels may be found. This field is specifically for locations of standing water';
-- ## --


-- ## Adding Column adult_mussels_location_code_id_1 on table high_risk_assessment
ALTER TABLE high_risk_assessment ADD COLUMN adult_mussels_location_code_id_1 INT NULL REFERENCES adult_mussels_location_code(adult_mussels_location_code_id) ON DELETE SET NULL;
COMMENT ON COLUMN high_risk_assessment.adult_mussels_location_code_id_1 IS 'Foreign key reference to code table (named adult_mussels_location_code) of possible locations on watercraft where standing water or adult mussels may be found. This field is specifically for locations where adult mussels were found on the watercraft';
-- ## --


-- ## Adding Column adult_mussels_location_code_id_2 on table high_risk_assessment
ALTER TABLE high_risk_assessment ADD COLUMN adult_mussels_location_code_id_2 INT NULL REFERENCES adult_mussels_location_code(adult_mussels_location_code_id) ON DELETE SET NULL;
COMMENT ON COLUMN high_risk_assessment.adult_mussels_location_code_id_2 IS 'Foreign key reference to code table (named adult_mussels_location_code) of possible locations on watercraft where standing water or adult mussels may be found. This field is specifically for locations where adult mussels were found on the watercraft';
-- ## --


-- ## Adding Column adult_mussels_location_code_id_3 on table high_risk_assessment
ALTER TABLE high_risk_assessment ADD COLUMN adult_mussels_location_code_id_3 INT NULL REFERENCES adult_mussels_location_code(adult_mussels_location_code_id) ON DELETE SET NULL;
COMMENT ON COLUMN high_risk_assessment.adult_mussels_location_code_id_3 IS 'Foreign key reference to code table (named adult_mussels_location_code) of possible locations on watercraft where standing water or adult mussels may be found. This field is specifically for locations where adult mussels were found on the watercraft';
-- ## --


-- ## Updating high_risk_assessment ## --
