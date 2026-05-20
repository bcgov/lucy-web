-- ## Changing table: watercraft_risk_assessment
-- ## Version: k9InspectionResults
-- ## Info: Adding new column k9InspectionResults
-- ## Adding New Columns ## --

-- ## Adding Column k9_inspection_results on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ADD COLUMN k9_inspection_results VARCHAR(100) NULL;
COMMENT ON COLUMN watercraft_risk_assessment.k9_inspection_results IS 'result of the k9 inspection';
-- ## --


-- ## Updating watercraft_risk_assessment ## --
