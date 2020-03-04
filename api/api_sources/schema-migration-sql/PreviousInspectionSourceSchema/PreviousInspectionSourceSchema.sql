-- ### Creating Table: previous_inspection_source_code ### --

        
CREATE TABLE previous_inspection_source_code ();
ALTER TABLE previous_inspection_source_code ADD COLUMN previous_inspection_source_code_id SERIAL PRIMARY KEY;
ALTER TABLE previous_inspection_source_code ADD COLUMN description VARCHAR(50) NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE previous_inspection_source_code IS 'Code table with options for sources of previous invasive mussel inspections';
COMMENT ON COLUMN previous_inspection_source_code.previous_inspection_source_code_id IS 'Auto generated sequential primary key column.';
COMMENT ON COLUMN previous_inspection_source_code.description IS 'Brief description of the source of the previous inspection(s)';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE previous_inspection_source_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE previous_inspection_source_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN previous_inspection_source_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN previous_inspection_source_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE previous_inspection_source_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE previous_inspection_source_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN previous_inspection_source_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN previous_inspection_source_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: previous_inspection_source_code ### --
