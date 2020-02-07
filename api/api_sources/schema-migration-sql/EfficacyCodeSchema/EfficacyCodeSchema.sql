-- ### Creating Table: efficacy_code ### --

        
CREATE TABLE efficacy_code ();
ALTER TABLE efficacy_code ADD COLUMN efficacy_code_id SERIAL PRIMARY KEY;
ALTER TABLE efficacy_code ADD COLUMN display_order INT NULL;
ALTER TABLE efficacy_code ADD COLUMN description VARCHAR(15) NOT NULL;
ALTER TABLE efficacy_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE efficacy_code IS 'Code table used in monitoring records for efficacy ratings of treatments';
COMMENT ON COLUMN efficacy_code.efficacy_code_id IS 'Auto generated sequential primary key column.';
COMMENT ON COLUMN efficacy_code.display_order IS 'Zero-indexed integer value indicating desired order of items in dropdown menu';
COMMENT ON COLUMN efficacy_code.description IS 'String indicating approximated treatment efficacy rating in percentage point ranges';
COMMENT ON COLUMN efficacy_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE efficacy_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE efficacy_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN efficacy_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN efficacy_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE efficacy_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE efficacy_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN efficacy_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN efficacy_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: efficacy_code ### --
