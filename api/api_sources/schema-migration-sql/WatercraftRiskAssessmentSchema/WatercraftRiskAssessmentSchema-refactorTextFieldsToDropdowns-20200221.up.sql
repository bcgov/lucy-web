-- ## Changing table: watercraft_risk_assessment
-- ## Version: refactorTextFieldsToDropdowns
-- ## Info: Adding foreign key references to adult_mussels_location, previous_ais_knowledge_source, and previous_inspection_source
-- ## Adding New Column and Altering two existing Columns ## --


-- ## Adding Column adult_mussels_location_id on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ADD COLUMN adult_mussels_location_id INT NULL REFERENCES adult_mussels_location(adult_mussels_location_id) ON DELETE SET NULL;
COMMENT ON COLUMN watercraft_risk_assessment.adult_mussels_location_id IS 'Foreign key reference to adult_mussels_location table';

-- ## Modifying Column previous_ais_knowledge_source on table watercraft_risk_assessment
-- ## by replacing it with previous_ais_knowledge_source_id
ALTER TABLE watercraft_risk_assessment DROP COLUMN previous_ais_knowledge_source;
ALTER TABLE watercraft_risk_assessment ADD COLUMN previous_ais_knowledge_source_id INT NULL REFERENCES previous_ais_knowledge_source(previous_ais_knowledge_source_id) ON DELETE SET NULL;
COMMENT ON COLUMN watercraft_risk_assessment.previous_ais_knowledge_source_id IS 'Foreign key reference to previous_ais_knowledge_source table';

-- ## Modifying Column previous_inspection_source on table watercraft_risk_assessment
-- ## by replacing it with previous_inspection_source_id
ALTER TABLE watercraft_risk_assessment DROP COLUMN previous_inspection_source;
ALTER TABLE watercraft_risk_assessment ADD COLUMN previous_inspection_source_id INT NULL REFERENCES previous_inspection_source(previous_inspection_source_id) ON DELETE SET NULL;
COMMENT ON COLUMN watercraft_risk_assessment.previous_inspection_source_id IS 'Foreign key reference to previous_inspection_source table';