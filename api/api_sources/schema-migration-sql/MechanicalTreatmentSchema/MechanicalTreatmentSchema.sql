-- ### Creating Table: mechanical_treatment ### --

        
CREATE TABLE mechanical_treatment ();
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_treatment_id SERIAL PRIMARY KEY;
ALTER TABLE mechanical_treatment ADD COLUMN applicator_first_name VARCHAR(100) NULL;
ALTER TABLE mechanical_treatment ADD COLUMN applicator_last_name VARCHAR(100) NULL;
ALTER TABLE mechanical_treatment ADD COLUMN secondary_applicator_first_name VARCHAR(100) NULL;
ALTER TABLE mechanical_treatment ADD COLUMN secondary_applicator_last_name VARCHAR(100) NULL;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_treatment_date DATE NOT NULL;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_treatment_paper_file_ref VARCHAR(100) NULL;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_treatment_comment VARCHAR(500) NULL;
ALTER TABLE mechanical_treatment ADD COLUMN signage_on_site_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE mechanical_treatment ADD COLUMN observation_id INT NOT NULL REFERENCES observation(observation_id) ON DELETE CASCADE;
ALTER TABLE mechanical_treatment ADD COLUMN species_id INT NULL REFERENCES species(species_id) ON DELETE CASCADE;
ALTER TABLE mechanical_treatment ADD COLUMN species_agency_code_id INT NULL REFERENCES species_agency_code(species_agency_code_id) ON DELETE SET NULL;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_method_code_id INT NULL REFERENCES mechanical_method_code(mechanical_method_code_id) ON DELETE SET NULL;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_disposal_method_code_id INT NULL REFERENCES mechanical_disposal_method_code(mechanical_disposal_method_code_id) ON DELETE SET NULL;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_soil_disturbance_code_id INT NULL REFERENCES mechanical_soil_disturbance_code(mechanical_soil_disturbance_code_id) ON DELETE SET NULL;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_root_removal_code_id INT NULL REFERENCES mechanical_root_removal_code(mechanical_root_removal_code_id) ON DELETE SET NULL;
ALTER TABLE mechanical_treatment ADD COLUMN mechanical_treatment_issue_code_id INT NULL REFERENCES mechanical_treatment_issue_code(mechanical_treatment_issue_code_id) ON DELETE SET NULL;
ALTER TABLE mechanical_treatment ADD COLUMN treatment_provider_contractor_id INT NULL REFERENCES treatment_provider_contractor(treatment_provider_contractor_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE mechanical_treatment IS 'An application of a mechanical or cultural control. Mechanical weed control employs various implements and techniques to physically disturb weeds or to interrupt their reproduction by depleting root reserves through repeated defoliation of the plant. Mechanical control includes the mowing, ploughing, chopping, and crushing of weeds. Cultural control includes selective grazing, irrigation and deliberate flooding, mulching, hand pulling, and burning. Strategies and timing should depend on the weed species and its location in the province.';
COMMENT ON COLUMN mechanical_treatment.mechanical_treatment_id IS 'Auto generated primary key';
COMMENT ON COLUMN mechanical_treatment.applicator_first_name IS 'First name of the applicator';
COMMENT ON COLUMN mechanical_treatment.applicator_last_name IS 'Last name of the applicator';
COMMENT ON COLUMN mechanical_treatment.secondary_applicator_first_name IS 'First name of the secondary applicator';
COMMENT ON COLUMN mechanical_treatment.secondary_applicator_last_name IS 'Last name of the secondary applicator';
COMMENT ON COLUMN mechanical_treatment.mechanical_treatment_date IS 'Date of the treatment';
COMMENT ON COLUMN mechanical_treatment.mechanical_treatment_paper_file_ref IS 'Paper file reference associated with treatment';
COMMENT ON COLUMN mechanical_treatment.mechanical_treatment_comment IS 'Comment on treatment record';
COMMENT ON COLUMN mechanical_treatment.signage_on_site_ind IS 'Sign collected for on site indicator';
COMMENT ON COLUMN mechanical_treatment.species_agency_code_id IS 'Foreign key reference to Species Agency Code table';
COMMENT ON COLUMN mechanical_treatment.mechanical_method_code_id IS 'Foreign key reference to Mechanical Method Code table';
COMMENT ON COLUMN mechanical_treatment.mechanical_disposal_method_code_id IS 'Foreign key reference to Mechanical Disposal Method Code table';
COMMENT ON COLUMN mechanical_treatment.mechanical_soil_disturbance_code_id IS 'Foreign key reference to Mechanical Soil Disturbance code';
COMMENT ON COLUMN mechanical_treatment.mechanical_root_removal_code_id IS 'Foreign key reference to Mechanical Root Removal Code table';
COMMENT ON COLUMN mechanical_treatment.mechanical_treatment_issue_code_id IS 'Foreign key reference to Mechanical Treatment Issue Code table';
COMMENT ON COLUMN mechanical_treatment.treatment_provider_contractor_id IS 'Foreign key reference to Mechanical Treatment Provider Contractor table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE mechanical_treatment ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE mechanical_treatment ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN mechanical_treatment.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN mechanical_treatment.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE mechanical_treatment ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE mechanical_treatment ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN mechanical_treatment.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN mechanical_treatment.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: mechanical_treatment ### --
