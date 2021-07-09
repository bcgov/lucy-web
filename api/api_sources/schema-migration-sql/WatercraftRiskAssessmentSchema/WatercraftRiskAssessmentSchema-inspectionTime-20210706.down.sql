-- ## Reverting table: watercraft_risk_assessment
-- ## Version: inspectionTime
-- ## Info: Adding new column inspectionTime
-- ## Removing New Columns ## --
ALTER TABLE watercraft_risk_assessment DROP COLUMN IF EXISTS inspection_time;

-- ## Updating watercraft_risk_assessment ## --
