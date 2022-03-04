-- ## Changing table: watercraft_risk_assessment
-- ## Version: dreissenidMusselsFoundPrevious
-- ## Info: Removing column DreissenidMusselsFoundPrevious

-- ## Removing New Columns ## --
ALTER TABLE watercraft_risk_assessment DROP COLUMN IF EXISTS dreissenid_mussels_found_previous;
-- ## --
