-- ## Changing table: watercraft_risk_assessment
-- ## Version: invertedFullyDrained
-- ## Info: Adding new column invertedFullyDrained
-- ## Adding New Columns ## --

-- ## Adding Column inverted_fully_drained on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ADD COLUMN inverted_fully_drained BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN watercraft_risk_assessment.inverted_fully_drained IS 'Indicator that the inspected watercraft was transported inverted and fully drained';
-- ## --


-- ## Updating watercraft_risk_assessment ## --
