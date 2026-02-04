-- ## Changing table: watercraft_risk_assessment
-- ## Version: officerInspection
-- ## Info: Adding new column officerInspection
-- ## Adding New Columns ## --

-- ## Adding Column officer_inspection_ind on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ADD COLUMN officer_inspection_ind BOOLEAN NULL DEFAULT FALSE;
COMMENT ON COLUMN watercraft_risk_assessment.officer_inspection_ind IS 'Indicator to show that inspection was directed by an officer after a blow by was returned to station';
-- ## --


-- ## Updating watercraft_risk_assessment ## --
