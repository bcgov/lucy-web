-- ### Creating Table: watercraft_journey ### --

        
CREATE TABLE watercraft_journey ();
ALTER TABLE watercraft_journey ADD COLUMN watercraft_journey_id SERIAL PRIMARY KEY;
ALTER TABLE watercraft_journey ADD COLUMN journey_type INT NOT NULL DEFAULT 0;
ALTER TABLE watercraft_journey ADD COLUMN number_of_days_out VARCHAR(25) NULL;
ALTER TABLE watercraft_journey ADD COLUMN other_water_body_detail VARCHAR(300) NULL;
ALTER TABLE watercraft_journey ADD COLUMN watercraft_risk_assessment_id INT NULL REFERENCES watercraft_risk_assessment(watercraft_risk_assessment_id) ON DELETE SET NULL;
ALTER TABLE watercraft_journey ADD COLUMN water_body_id INT NULL REFERENCES water_body(water_body_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE watercraft_journey IS 'Joining table for water-body details and a inspection';
COMMENT ON COLUMN watercraft_journey.watercraft_journey_id IS 'Auto generated sequential primary key column.';
COMMENT ON COLUMN watercraft_journey.journey_type IS 'Journey type of the associated regarding water body. i.e Previous (0) and next (1)';
COMMENT ON COLUMN watercraft_journey.number_of_days_out IS 'Number of days out of water';
COMMENT ON COLUMN watercraft_journey.other_water_body_detail IS 'Details of not listed water body. This is an optional field. User can provide a brief description of water-body which is not listed in application water body list.';
COMMENT ON COLUMN watercraft_journey.watercraft_risk_assessment_id IS 'Foreign key reference to Watercraft risk assessment table';
COMMENT ON COLUMN watercraft_journey.water_body_id IS 'Foreign key reference to Water body detail table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE watercraft_journey ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE watercraft_journey ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN watercraft_journey.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN watercraft_journey.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE watercraft_journey ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE watercraft_journey ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN watercraft_journey.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN watercraft_journey.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: watercraft_journey ### --
