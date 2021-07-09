-- ## Changing table: watercraft_risk_assessment
-- ## Version: inspectionTime
-- ## Info: Adding new column inspectionTime
-- ## Adding New Columns ## --

-- ## Adding Column inspection_time on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ADD COLUMN inspection_time VARCHAR(100) NULL;
COMMENT ON COLUMN watercraft_risk_assessment.inspection_time IS 'The time of the inspection';
-- ## --


-- ## Updating watercraft_risk_assessment ## --
