-- ### Creating Table: chemical_treatment ### --

        
CREATE TABLE chemical_treatment ();
ALTER TABLE chemical_treatment ADD COLUMN chemical_treatment_id SERIAL PRIMARY KEY;
ALTER TABLE chemical_treatment ADD COLUMN chemical_treatment_location_latitude NUMERIC(8, 6) NOT NULL;
ALTER TABLE chemical_treatment ADD COLUMN chemical_treatment_location_longitude NUMERIC(9, 6) NOT NULL;
ALTER TABLE chemical_treatment ADD COLUMN chemical_treatment_date DATE NOT NULL;
ALTER TABLE chemical_treatment ADD COLUMN chemical_treatment_primary_paper_file_ref VARCHAR(100) NULL;
ALTER TABLE chemical_treatment ADD COLUMN chemical_treatment_secondary_paper_file_ref VARCHAR(100) NULL;
ALTER TABLE chemical_treatment ADD COLUMN species_agency_code_id INT NULL REFERENCES species_agency_code(species_agency_code_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE chemical_treatment IS 'An application of a herbicide. Various herbicides are used for spot treatments of weeds in British Columbia. The herbicide selected should depend on the target weed species and environmental factors. Application rate will be dictated by the size and accessibility of the infestation, its proximity to wells and other water, and the potential impacts of the application on non-target vegetation. Some herbicides have residual effects and persist in the soil in an active state for some time after application. Other herbicides become inactive once they contact soil. The residual activity of a herbicide varies with rate of application, soil properties, and climate, and its impact on non-target vegetation should be carefully considered.
To types of herbicide formats: granular and liquid. IAPP allows for liquid particulars only. Lucy will need to cover off both.';
COMMENT ON COLUMN chemical_treatment.chemical_treatment_id IS 'Auto generated primary key. This is auto incremental field';
COMMENT ON COLUMN chemical_treatment.chemical_treatment_location_latitude IS 'Latitude of treatment  location';
COMMENT ON COLUMN chemical_treatment.chemical_treatment_location_longitude IS 'Longitude of treatment location';
COMMENT ON COLUMN chemical_treatment.chemical_treatment_date IS 'Date of the treatment';
COMMENT ON COLUMN chemical_treatment.chemical_treatment_primary_paper_file_ref IS 'Primary paper file Paper file reference associated with treatment';
COMMENT ON COLUMN chemical_treatment.chemical_treatment_secondary_paper_file_ref IS 'Secondary paper file Paper file reference associated with treatment';
COMMENT ON COLUMN chemical_treatment.species_agency_code_id IS 'Foreign key reference to Species Agency Code table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE chemical_treatment ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE chemical_treatment ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN chemical_treatment.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN chemical_treatment.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE chemical_treatment ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE chemical_treatment ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN chemical_treatment.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN chemical_treatment.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: chemical_treatment ### --
