-- ### Creating Table: mechanical_treatment_issue_code ### --

        
CREATE TABLE mechanical_treatment_issue_code ();
ALTER TABLE mechanical_treatment_issue_code ADD COLUMN mechanical_treatment_issue_code_id SERIAL PRIMARY KEY;
ALTER TABLE mechanical_treatment_issue_code ADD COLUMN mechanical_treatment_issue_code VARCHAR(6) NOT NULL UNIQUE;
ALTER TABLE mechanical_treatment_issue_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE mechanical_treatment_issue_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE mechanical_treatment_issue_code IS 'This table is collection of code related to mechanical treatments';
COMMENT ON COLUMN mechanical_treatment_issue_code.mechanical_treatment_issue_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN mechanical_treatment_issue_code.mechanical_treatment_issue_code IS 'String encoded enum values for issue code related to mechanical treatments.';
COMMENT ON COLUMN mechanical_treatment_issue_code.description IS 'Description of code';
COMMENT ON COLUMN mechanical_treatment_issue_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE mechanical_treatment_issue_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE mechanical_treatment_issue_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN mechanical_treatment_issue_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN mechanical_treatment_issue_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE mechanical_treatment_issue_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE mechanical_treatment_issue_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN mechanical_treatment_issue_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN mechanical_treatment_issue_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: mechanical_treatment_issue_code ### --
