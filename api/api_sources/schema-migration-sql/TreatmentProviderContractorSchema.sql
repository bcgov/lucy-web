-- ### Creating Table: treatment_provider_contractor ### --

        
CREATE TABLE treatment_provider_contractor ();
ALTER TABLE treatment_provider_contractor ADD COLUMN treatment_provider_contractor_id SERIAL PRIMARY KEY;
ALTER TABLE treatment_provider_contractor ADD COLUMN registration_number INT NOT NULL UNIQUE;
ALTER TABLE treatment_provider_contractor ADD COLUMN business_name VARCHAR(100) NOT NULL;
ALTER TABLE treatment_provider_contractor ADD COLUMN category VARCHAR(100) NOT NULL;
ALTER TABLE treatment_provider_contractor ADD COLUMN address VARCHAR(200) NOT NULL;
ALTER TABLE treatment_provider_contractor ADD COLUMN region_operation VARCHAR(1000) NULL;
ALTER TABLE treatment_provider_contractor ADD COLUMN license_expiry_date DATE NOT NULL;
ALTER TABLE treatment_provider_contractor ADD COLUMN service_provide_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE treatment_provider_contractor IS 'Treatment providers are govt contractors, who executes/applies treatment. This table contains list of such contractor and their details.';
COMMENT ON COLUMN treatment_provider_contractor.treatment_provider_contractor_id IS 'Auto generated primary key';
COMMENT ON COLUMN treatment_provider_contractor.registration_number IS 'The registration number associated with contractor';
COMMENT ON COLUMN treatment_provider_contractor.business_name IS 'The name of the contactor organization';
COMMENT ON COLUMN treatment_provider_contractor.category IS 'The category label mentioned for contractor';
COMMENT ON COLUMN treatment_provider_contractor.address IS 'The address of the contractor';
COMMENT ON COLUMN treatment_provider_contractor.region_operation IS 'Comma separated values of region of operation. Example LOWER MAINLAND, OMINECA, PEACE';
COMMENT ON COLUMN treatment_provider_contractor.license_expiry_date IS 'Date of expiry of license of contractor';
COMMENT ON COLUMN treatment_provider_contractor.service_provide_ind IS 'Indicator to show, associated contractor is active or not';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE treatment_provider_contractor ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE treatment_provider_contractor ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN treatment_provider_contractor.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN treatment_provider_contractor.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE treatment_provider_contractor ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE treatment_provider_contractor ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN treatment_provider_contractor.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN treatment_provider_contractor.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: treatment_provider_contractor ### --
