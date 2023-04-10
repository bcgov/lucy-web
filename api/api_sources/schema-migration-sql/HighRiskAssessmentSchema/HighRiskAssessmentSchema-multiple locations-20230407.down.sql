-- ## Reverting table: high_risk_assessment
-- ## Version: multipleLocations
-- ## Info: Adding multipleLocations
-- ## Removing New Columns ## --
ALTER TABLE high_risk_assessment DROP COLUMN IF EXISTS standing_water_location_code_id_1;
ALTER TABLE high_risk_assessment DROP COLUMN IF EXISTS standing_water_location_code_id_2;
ALTER TABLE high_risk_assessment DROP COLUMN IF EXISTS standing_water_location_code_id_3;
ALTER TABLE high_risk_assessment DROP COLUMN IF EXISTS adult_mussels_location_code_id_1;
ALTER TABLE high_risk_assessment DROP COLUMN IF EXISTS adult_mussels_location_code_id_2;
ALTER TABLE high_risk_assessment DROP COLUMN IF EXISTS adult_mussels_location_code_id_3;

-- ## Updating high_risk_assessment ## --
