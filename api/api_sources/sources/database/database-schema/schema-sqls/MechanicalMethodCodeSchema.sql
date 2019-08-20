-- ### Creating Table: mechanical_method_code ### --

        
CREATE TABLE mechanical_method_code ();
ALTER TABLE mechanical_method_code ADD COLUMN mechanical_method_code_id SERIAL PRIMARY KEY;
ALTER TABLE mechanical_method_code ADD COLUMN mechanical_method_code VARCHAR(4) NOT NULL UNIQUE;
ALTER TABLE mechanical_method_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE mechanical_method_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE mechanical_method_code IS 'Indicates the method of mechanical or cultural control. Examples: mulching, burning, mowing. IAPP methods: Controlled Burning, Cultivation or till, Dead-heading, Digging, Flaming / Tiger Torch burn, Hand pulling, Hot water / Steam, Mowing Mulching, Suction dredging, Sheet Mulching , Salt water / Vinegar, Targeted grazing, Tarping , Seeding, Planting';
COMMENT ON COLUMN mechanical_method_code.mechanical_method_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN mechanical_method_code.mechanical_method_code IS 'String encoded enum values for Mechanical treatment methods.';
COMMENT ON COLUMN mechanical_method_code.description IS 'Description of code';
COMMENT ON COLUMN mechanical_method_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE mechanical_method_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE mechanical_method_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN mechanical_method_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN mechanical_method_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE mechanical_method_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE mechanical_method_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN mechanical_method_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN mechanical_method_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: mechanical_method_code ### --
