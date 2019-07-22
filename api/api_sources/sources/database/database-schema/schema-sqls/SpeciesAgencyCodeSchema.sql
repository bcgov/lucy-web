-- ### Creating Table: species_agency_code ### --

        
CREATE TABLE species_agency_code ();
ALTER TABLE species_agency_code ADD COLUMN species_agency_code_id SERIAL PRIMARY KEY;
ALTER TABLE species_agency_code ADD COLUMN species_agency_code VARCHAR(10) NOT NULL UNIQUE;
ALTER TABLE species_agency_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE species_agency_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE species_agency_code IS 'Code table for schema of species agencies';
COMMENT ON COLUMN species_agency_code.species_agency_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN species_agency_code.species_agency_code IS 'Agency code values for managing invasive species';
COMMENT ON COLUMN species_agency_code.description IS 'Description of code';
COMMENT ON COLUMN species_agency_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE species_agency_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE species_agency_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN species_agency_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN species_agency_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE species_agency_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE species_agency_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN species_agency_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN species_agency_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: species_agency_code ### --
