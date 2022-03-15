-- ## Changing table: watercraft_risk_assessment
-- ## Version: previousInspectionDays
-- ## Info: Adding column CleanDrainDryAfterInspection
-- ## Adding New Columns ## --

-- ## Adding Column clean_drain_dry_after_inspection_ind on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ADD COLUMN clean_drain_dry_after_inspection_ind BOOLEAN NOT NULL DEFAULT FALSE;
-- ## --
