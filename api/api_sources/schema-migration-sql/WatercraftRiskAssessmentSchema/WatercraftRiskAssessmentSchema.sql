-- ### Creating Table: watercraft_risk_assessment ### --

        
CREATE TABLE watercraft_risk_assessment ();
ALTER TABLE watercraft_risk_assessment ADD COLUMN watercraft_risk_assessment_id SERIAL PRIMARY KEY;
ALTER TABLE watercraft_risk_assessment ADD COLUMN timestamp TIMESTAMP NOT NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN high_risk_assessment_form JSONB NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN low_risk_assessment_form JSONB NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE watercraft_risk_assessment IS 'This is schema for data model of water craft observation for invasive aquatic species specially Mussels. This data model will be used to capture all kind of variables related to a water craft observation';
COMMENT ON COLUMN watercraft_risk_assessment.watercraft_risk_assessment_id IS 'Auto generated primary key';
COMMENT ON COLUMN watercraft_risk_assessment.timestamp IS 'Date and time of watercraft observation.';
COMMENT ON COLUMN watercraft_risk_assessment.high_risk_assessment_form IS 'Stored JSON structure for whole high risk form data';
COMMENT ON COLUMN watercraft_risk_assessment.low_risk_assessment_form IS 'Stored JSON structure for whole high low risk form data';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE watercraft_risk_assessment ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE watercraft_risk_assessment ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN watercraft_risk_assessment.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN watercraft_risk_assessment.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE watercraft_risk_assessment ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN watercraft_risk_assessment.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN watercraft_risk_assessment.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: watercraft_risk_assessment ### --
