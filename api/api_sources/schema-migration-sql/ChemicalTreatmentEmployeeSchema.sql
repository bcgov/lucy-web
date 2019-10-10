-- ### Creating Table: chemical_treatment_employee ### --

        
CREATE TABLE chemical_treatment_employee ();
ALTER TABLE chemical_treatment_employee ADD COLUMN chemical_treatment_employee_id SERIAL PRIMARY KEY;
ALTER TABLE chemical_treatment_employee ADD COLUMN certificate VARCHAR(20) NOT NULL;
ALTER TABLE chemical_treatment_employee ADD COLUMN first_name VARCHAR(99) NOT NULL;
ALTER TABLE chemical_treatment_employee ADD COLUMN last_name VARCHAR(99) NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE chemical_treatment_employee IS 'The contractor employee who applied chemical treatment.';
COMMENT ON COLUMN chemical_treatment_employee.chemical_treatment_employee_id IS 'Auto generated primary key. This is auto incremental field';
COMMENT ON COLUMN chemical_treatment_employee.certificate IS 'Certificate number associated with employee';
COMMENT ON COLUMN chemical_treatment_employee.first_name IS 'First name of the employee';
COMMENT ON COLUMN chemical_treatment_employee.last_Name IS 'Last name of the employee';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE chemical_treatment_employee ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE chemical_treatment_employee ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN chemical_treatment_employee.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN chemical_treatment_employee.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE chemical_treatment_employee ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE chemical_treatment_employee ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN chemical_treatment_employee.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN chemical_treatment_employee.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: chemical_treatment_employee ### --
