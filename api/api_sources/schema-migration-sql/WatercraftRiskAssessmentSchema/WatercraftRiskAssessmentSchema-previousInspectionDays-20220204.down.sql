-- ## Changing table: watercraft_risk_assessment
-- ## Version: previousInspectionDays
-- ## Info: Reverting column previous_inspection_days_count to its previous state
-- ## Adding New Columns ## --

-- ## Updating Column previous_inspection_days_count on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ALTER COLUMN previous_inspection_days_count TYPE INT USING previous_inspection_days_count::integer;
-- ## --
