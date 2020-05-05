-- ### Creating Table: chemical_treatment_method ### --

        
CREATE TABLE chemical_treatment_method ();
ALTER TABLE chemical_treatment_method ADD COLUMN chemical_treatment_method_id SERIAL PRIMARY KEY;
ALTER TABLE chemical_treatment_method ADD COLUMN treatment_method_code VARCHAR(3) NOT NULL;
ALTER TABLE chemical_treatment_method ADD COLUMN treatment_method_description VARCHAR(30) NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE chemical_treatment_method IS 'The method used to apply the chemical to the treatment area.';
COMMENT ON COLUMN chemical_treatment_method.chemical_treatment_method_id IS 'Auto generated primary key. This is auto incremental field';
COMMENT ON COLUMN chemical_treatment_method.treatment_method_code IS 'The 3-letter code used to identify the treatment method';
COMMENT ON COLUMN chemical_treatment_method.treatment_method_description IS 'The name of the treatment method as it should be displayed to users';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE chemical_treatment_method ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE chemical_treatment_method ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN chemical_treatment_method.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN chemical_treatment_method.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE chemical_treatment_method ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE chemical_treatment_method ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN chemical_treatment_method.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN chemical_treatment_method.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: chemical_treatment_method ### --
