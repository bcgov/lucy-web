-- ## Reverting table: watercraft_risk_assessment
-- ## Version: officerInspection
-- ## Info: Adding new column officerInspection
-- ## Removing New Columns ## --
ALTER TABLE watercraft_risk_assessment DROP COLUMN IF EXISTS officer_inspection_ind;

-- ## Updating watercraft_risk_assessment ## --
