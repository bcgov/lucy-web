-- ## Reverting table: watercraft_risk_assessment
-- ## Version: invertedFullyDrained
-- ## Info: Adding new column invertedFullyDrained
-- ## Removing New Columns ## --
ALTER TABLE watercraft_risk_assessment DROP COLUMN IF EXISTS inverted_fully_drained;

-- ## Updating watercraft_risk_assessment ## --
