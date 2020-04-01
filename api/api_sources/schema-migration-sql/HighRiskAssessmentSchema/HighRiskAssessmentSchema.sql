-- ### Creating Table: high_risk_assessment ### --

        
CREATE TABLE high_risk_assessment ();
ALTER TABLE high_risk_assessment ADD COLUMN high_risk_assessment_id SERIAL PRIMARY KEY;
ALTER TABLE high_risk_assessment ADD COLUMN clean_drain_dry_after_inspection_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE high_risk_assessment ADD COLUMN quarantine_period_issued_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE high_risk_assessment ADD COLUMN standing_water_present_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE high_risk_assessment ADD COLUMN adult_dreissenidae_mussel_found_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE high_risk_assessment ADD COLUMN decontamination_performed_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE high_risk_assessment ADD COLUMN decontamination_order_issued_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE high_risk_assessment ADD COLUMN seal_issued_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE high_risk_assessment ADD COLUMN watercraft_registration VARCHAR(30) NULL;
ALTER TABLE high_risk_assessment ADD COLUMN decontamination_reference VARCHAR(100) NULL;
ALTER TABLE high_risk_assessment ADD COLUMN decontamination_order_number INT NULL;
ALTER TABLE high_risk_assessment ADD COLUMN seal_number INT NULL;
ALTER TABLE high_risk_assessment ADD COLUMN other_inspection_findings VARCHAR(100) NULL;
ALTER TABLE high_risk_assessment ADD COLUMN general_comments VARCHAR(300) NULL;
ALTER TABLE high_risk_assessment ADD COLUMN standing_water_location_code_id INT NULL REFERENCES adult_mussels_location_code(adult_mussels_location_code_id) ON DELETE SET NULL;
ALTER TABLE high_risk_assessment ADD COLUMN adult_mussels_location_code_id INT NULL REFERENCES adult_mussels_location_code(adult_mussels_location_code_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE high_risk_assessment IS 'Table to store High Risk Assessment information of Mussel Watercraft inspection';
COMMENT ON COLUMN high_risk_assessment.high_risk_assessment_id IS 'Auto generated sequential primary key column.';
COMMENT ON COLUMN high_risk_assessment.clean_drain_dry_after_inspection_ind IS 'Indicator is to show, watercraft was cleaned, drained and dried after inspection';
COMMENT ON COLUMN high_risk_assessment.quarantine_period_issued_ind IS 'Indicator is to show, watercraft was issued a quarantine period';
COMMENT ON COLUMN high_risk_assessment.standing_water_present_ind IS 'Indicator is to check any standing water present in watercraft during high risk assessment';
COMMENT ON COLUMN high_risk_assessment.adult_dreissenidae_mussel_found_ind IS 'Status flag any adult Dreissenidae Mussel found during inspection';
COMMENT ON COLUMN high_risk_assessment.decontamination_performed_ind IS 'Status flag to check decontamination performed or not';
COMMENT ON COLUMN high_risk_assessment.decontamination_order_issued_ind IS 'Status flag to check decontamination order issued or not';
COMMENT ON COLUMN high_risk_assessment.seal_issued_ind IS 'Status flag to check seal was issued or not';
COMMENT ON COLUMN high_risk_assessment.watercraft_registration IS 'Watercraft Registration number';
COMMENT ON COLUMN high_risk_assessment.decontamination_reference IS 'Decontamination reference number';
COMMENT ON COLUMN high_risk_assessment.decontamination_order_number IS 'Decontamination order number';
COMMENT ON COLUMN high_risk_assessment.seal_number IS 'Seal number';
COMMENT ON COLUMN high_risk_assessment.other_inspection_findings IS 'Additional details about high risk assessment';
COMMENT ON COLUMN high_risk_assessment.general_comments IS 'General Comments regarding high risk assessment';
COMMENT ON COLUMN high_risk_assessment.standing_water_location_code_id IS 'Foreign key reference to code table (named adult_mussels_location_code) of possible locations on watercraft where standing water or adult mussels may be found. This field is specifically for locations of standing water';
COMMENT ON COLUMN high_risk_assessment.adult_mussels_location_code_id IS 'Foreign key reference to code table (named adult_mussels_location_code) of possible locations on watercraft where standing water or adult mussels may be found. This field is specifically for locations where adult mussels were found on the watercraft';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE high_risk_assessment ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE high_risk_assessment ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN high_risk_assessment.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN high_risk_assessment.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE high_risk_assessment ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE high_risk_assessment ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN high_risk_assessment.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN high_risk_assessment.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: high_risk_assessment ### --
