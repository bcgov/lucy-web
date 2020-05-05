-- ## Changing table: watercraft_risk_assessment
-- ## Version: workflow
-- ## Info: Adding workflow foreign key reference
-- ## Adding New Columns ## --

-- ## Adding Column observer_workflow_id on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ADD COLUMN observer_workflow_id INT NULL REFERENCES observer_workflow(observer_workflow_id) ON DELETE SET NULL;
COMMENT ON COLUMN watercraft_risk_assessment.observer_workflow_id IS 'Foreign key reference to reference to observer_workflow table';
-- ## --


-- ## Updating watercraft_risk_assessment ## --
