-- ## Reverting table: watercraft_risk_assessment
-- ## Version: workflow
-- ## Info: Adding workflow foreign key reference
-- ## Removing New Columns ## --
ALTER TABLE watercraft_risk_assessment DROP COLUMN IF EXISTS observer_workflow_id;

-- ## Updating watercraft_risk_assessment ## --
