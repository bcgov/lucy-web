-- ## Changing table: watercraft_risk_assessment
-- ## Version: previousInspectionDays
-- ## Info: Removing column CleanDrainDryAfterInspection

-- ## Removing New Columns ## --
ALTER TABLE watercraft_risk_assessment DROP COLUMN IF EXISTS clean_drain_dry_after_inspection_ind;
-- ## --
