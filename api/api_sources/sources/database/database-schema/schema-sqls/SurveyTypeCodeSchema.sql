-- ### Creating Table: survey_type_code ### --

        
CREATE TABLE survey_type_code ();
ALTER TABLE survey_type_code ADD COLUMN survey_type_code_id SERIAL PRIMARY KEY;
ALTER TABLE survey_type_code ADD COLUMN survey_type_code VARCHAR(5) NOT NULL UNIQUE;
ALTER TABLE survey_type_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE survey_type_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE survey_type_code IS 'Code table for schema of survey types';
COMMENT ON COLUMN survey_type_code.survey_type_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN survey_type_code.survey_type_code IS 'Code value for survey types';
COMMENT ON COLUMN survey_type_code.description IS 'Description of code';
COMMENT ON COLUMN survey_type_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE survey_type_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE survey_type_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN survey_type_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN survey_type_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE survey_type_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE survey_type_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN survey_type_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN survey_type_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: survey_type_code ### --
