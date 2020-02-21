-- ## Reverting table: watercraft_risk_assessment
-- ## Version: refactorTextFieldsToDropdowns
-- ## Info: Adding workflow foreign key reference

-- ## Removing New Columns ## --
ALTER TABLE watercraft_risk_assessment DROP COLUMN IF EXISTS adult_mussels_location_id;

-- ## Un-doing modifications to existing columns ## --
ALTER TABLE watercraft_risk_assessment RENAME COLUMN previous_ais_knowledge_source_id TO previous_ais_knowledge_source;
ALTER TABLE watercraft_risk_assessment ALTER COLUMN previous_ais_knowledge_source TYPE VARCHAR(100);
COMMENT ON COLUMN watercraft_risk_assessment.previous_ais_knowledge_source IS 'Indicator to store status of previous AIS knowledge';

ALTER TABLE watercraft_risk_assessment RENAME COLUMN previous_inspection_source_id TO previous_inspection_source;
ALTER TABLE watercraft_risk_assessment ALTER COLUMN previous_inspection_source TYPE VARCHAR(100);
COMMENT ON COLUMN watercraft_risk_assessment.previous_inspection_source IS 'Indicator to store status of previous inspection';