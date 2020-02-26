-- ### Creating Table: watercraft_risk_assessment ### --

        
CREATE TABLE watercraft_risk_assessment ();
ALTER TABLE watercraft_risk_assessment ADD COLUMN watercraft_risk_assessment_id SERIAL PRIMARY KEY;
ALTER TABLE watercraft_risk_assessment ADD COLUMN timestamp TIMESTAMP NOT NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN passport_holder_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN k9_inspection_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN marine_species_found_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN aquatic_plants_found_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN previous_ais_knowledge_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN previous_inspection_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN marine_mussel_found_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN adult_dreissenidae_found_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN launched_outside_bc_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN decontamination_performed_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN commercially_hauled_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN high_risk_area_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN high_risk_ais_ind BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE watercraft_risk_assessment ADD COLUMN non_motorized_counter INT NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN simple_counter INT NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN complex_counter INT NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN very_complex_count INT NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN previous_inspection_days_count INT NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN province VARCHAR(100) NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN general_comment VARCHAR(300) NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN passport_number VARCHAR(100) NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN high_risk_assessment_id INT NULL REFERENCES high_risk_assessment(high_risk_assessment_id) ON DELETE SET NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN adult_mussels_location_id INT NULL REFERENCES adult_mussels_location(adult_mussels_location_id) ON DELETE SET NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN previous_ais_knowledge_source_id INT NULL REFERENCES previous_ais_knowledge_source(previous_ais_knowledge_source_id) ON DELETE SET NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN previous_inspection_source_id INT NULL REFERENCES previous_inspection_source(previous_inspection_source_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE watercraft_risk_assessment IS 'This is schema for data model of water craft observation for invasive aquatic species specially Mussels. This data model will be used to capture all kind of variables related to a water craft observation';
COMMENT ON COLUMN watercraft_risk_assessment.watercraft_risk_assessment_id IS 'Auto generated primary key';
COMMENT ON COLUMN watercraft_risk_assessment.timestamp IS 'Date and time of watercraft observation.';
COMMENT ON COLUMN watercraft_risk_assessment.passport_holder_ind IS 'Indicator to show that inspected boat has previously issued passport';
COMMENT ON COLUMN watercraft_risk_assessment.k9_inspection_ind IS 'Indicator to show that inspection type is K9';
COMMENT ON COLUMN watercraft_risk_assessment.marine_species_found_ind IS 'Indicator to show any marine species found during inspection';
COMMENT ON COLUMN watercraft_risk_assessment.aquatic_plants_found_ind IS 'Indicator to show any aquatic plants found during inspection';
COMMENT ON COLUMN watercraft_risk_assessment.previous_ais_knowledge_ind IS 'Indicator to store status of previous AIS knowledge';
COMMENT ON COLUMN watercraft_risk_assessment.previous_inspection_ind IS 'Indicator to store status of previous inspection';
COMMENT ON COLUMN watercraft_risk_assessment.marine_mussel_found_ind IS 'Indicator to store status marine mussel found during inspection';
COMMENT ON COLUMN watercraft_risk_assessment.adult_dreissenidae_found_ind IS 'Status flag any adult Dreissenidae found during inspection';
COMMENT ON COLUMN watercraft_risk_assessment.launched_outside_bc_ind IS 'Status flag to check the boat was launched outside of bc or not';
COMMENT ON COLUMN watercraft_risk_assessment.decontamination_performed_ind IS 'Status flag to check any decontamination performed during inspection';
COMMENT ON COLUMN watercraft_risk_assessment.commercially_hauled_ind IS 'Status flag to check inspected boats are commercially hauled or not';
COMMENT ON COLUMN watercraft_risk_assessment.high_risk_area_ind IS 'Indicator flag to check boats are from High risk area or not.';
COMMENT ON COLUMN watercraft_risk_assessment.high_risk_ais_ind IS 'Indicator flag to check high risk AIS or not';
COMMENT ON COLUMN watercraft_risk_assessment.non_motorized_counter IS 'Counter for non motorized boats in inspection';
COMMENT ON COLUMN watercraft_risk_assessment.simple_counter IS 'Counter for number of simple boats in the inspection';
COMMENT ON COLUMN watercraft_risk_assessment.complex_counter IS 'Counter for number of complex boats in the inspection';
COMMENT ON COLUMN watercraft_risk_assessment.very_complex_count IS 'Counter for number of very complex boats in the inspection';
COMMENT ON COLUMN watercraft_risk_assessment.previous_inspection_days_count IS 'Counter for number of very complex boats in the inspection';
COMMENT ON COLUMN watercraft_risk_assessment.province IS 'Province of residence of the boat';
COMMENT ON COLUMN watercraft_risk_assessment.general_comment IS 'Province of residence of the boat';
COMMENT ON COLUMN watercraft_risk_assessment.passport_number IS 'Passport number associated with previous inspection';
COMMENT ON COLUMN watercraft_risk_assessment.high_risk_assessment_id IS 'Foreign key reference to High risk assessment of the inspection';
COMMENT ON COLUMN watercraft_risk_assessment.adult_mussels_location_id IS 'Foreign key reference to adult_mussels_location table';
COMMENT ON COLUMN watercraft_risk_assessment.previous_ais_knowledge_source_id IS 'Foreign key reference to previous_ais_knowledge_source table';
COMMENT ON COLUMN watercraft_risk_assessment.previous_inspection_source_id IS 'Foreign key reference to previous_inspection_source table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE watercraft_risk_assessment ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE watercraft_risk_assessment ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN watercraft_risk_assessment.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN watercraft_risk_assessment.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE watercraft_risk_assessment ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE watercraft_risk_assessment ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN watercraft_risk_assessment.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN watercraft_risk_assessment.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: watercraft_risk_assessment ### --
