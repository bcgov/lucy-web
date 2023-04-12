-- ## Reverting table: watercraft_risk_assessment
-- ## Version: k9InspectionResults
-- ## Info: Adding new column inspectionTime
-- ## Removing New Columns ## --
ALTER TABLE watercraft_risk_assessment DROP COLUMN IF EXISTS k9_inspection_results;

-- ## Updating watercraft_risk_assessment ## --
