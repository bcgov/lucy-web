-- ### Creating Table: wind_direction_code ### --

        
CREATE TABLE wind_direction_code ();
ALTER TABLE wind_direction_code ADD COLUMN wind_direction_code_id SERIAL PRIMARY KEY;
ALTER TABLE wind_direction_code ADD COLUMN wind_direction_code VARCHAR(3) NOT NULL;
ALTER TABLE wind_direction_code ADD COLUMN description VARCHAR(50) NOT NULL;
ALTER TABLE wind_direction_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE wind_direction_code IS 'List of valid menu items to be displayed in dropdown menu for Wind Direction';
COMMENT ON COLUMN wind_direction_code.wind_direction_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN wind_direction_code.wind_direction_code IS 'Identifier as code';
COMMENT ON COLUMN wind_direction_code.description IS 'Description of wind direction code';
COMMENT ON COLUMN wind_direction_code.active_ind IS 'Indicator to check active status of code';

        
-- ### Creating Timestamp column ### --

        
ALTER TABLE wind_direction_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE wind_direction_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN wind_direction_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN wind_direction_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE wind_direction_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE wind_direction_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN wind_direction_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN wind_direction_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: wind_direction_code ### --
