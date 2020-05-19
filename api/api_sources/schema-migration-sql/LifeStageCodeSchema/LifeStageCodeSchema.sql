-- ### Creating Table: life_stage_code ### --

        
CREATE TABLE life_stage_code ();
ALTER TABLE life_stage_code ADD COLUMN life_stage_code_id SERIAL PRIMARY KEY;
ALTER TABLE life_stage_code ADD COLUMN life_stage_code VARCHAR(10) NOT NULL UNIQUE;
ALTER TABLE life_stage_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE life_stage_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE life_stage_code IS 'This is a list of all the different life stages for a species';
COMMENT ON COLUMN life_stage_code.life_stage_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN life_stage_code.life_stage_code IS 'Code value for the life stages';
COMMENT ON COLUMN life_stage_code.description IS 'Description of code';
COMMENT ON COLUMN life_stage_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE life_stage_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE life_stage_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN life_stage_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN life_stage_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE life_stage_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE life_stage_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN life_stage_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN life_stage_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: life_stage_code ### --
