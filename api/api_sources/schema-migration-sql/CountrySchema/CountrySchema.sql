-- ### Creating Table: country ### --

        
CREATE TABLE country ();
ALTER TABLE country ADD COLUMN country_code VARCHAR(3) PRIMARY KEY;
ALTER TABLE country ADD COLUMN description VARCHAR(100) NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE country IS 'Standard ISO-3166 code table for listed countries';
COMMENT ON COLUMN country.country_code IS 'ISO-3166 standard three character identifier for country name. Primary key of the table.';
COMMENT ON COLUMN country.description IS 'Detail name of the country';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE country ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE country ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN country.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN country.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE country ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE country ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN country.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN country.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: country ### --
