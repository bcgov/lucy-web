-- ### Creating Table: pesticide_employer_code ### --

        
CREATE TABLE pesticide_employer_code ();
ALTER TABLE pesticide_employer_code ADD COLUMN pesticide_employer_code_id SERIAL PRIMARY KEY;
ALTER TABLE pesticide_employer_code ADD COLUMN registration_number INT NOT NULL UNIQUE;
ALTER TABLE pesticide_employer_code ADD COLUMN business_name VARCHAR(100) NOT NULL;
ALTER TABLE pesticide_employer_code ADD COLUMN licence_expiry_date DATE NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE pesticide_employer_code IS 'Table to store contractor/employer information chemical treatment service providers.';
COMMENT ON COLUMN pesticide_employer_code.pesticide_employer_code_id IS 'Auto generated primary key. This is auto incremental field';
COMMENT ON COLUMN pesticide_employer_code.registration_number IS 'Registration number associated with employer';
COMMENT ON COLUMN pesticide_employer_code.business_name IS 'Name of the employer';
COMMENT ON COLUMN pesticide_employer_code.licence_expiry_date IS 'Date of expiry of license';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE pesticide_employer_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE pesticide_employer_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN pesticide_employer_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN pesticide_employer_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE pesticide_employer_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE pesticide_employer_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN pesticide_employer_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN pesticide_employer_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: pesticide_employer_code ### --
