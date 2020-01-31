-- ### Creating Table: country_province ### --

        
CREATE TABLE country_province ();
ALTER TABLE country_province ADD COLUMN province_code VARCHAR(2) NOT NULL;
ALTER TABLE country_province ADD COLUMN country_code VARCHAR(3) NOT NULL;
ALTER TABLE country_province ADD COLUMN description VARCHAR(100) NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE country_province IS 'Standard ISO-3166 code table for listed countries and provinces';
COMMENT ON COLUMN country_province.province_code IS 'ISO-3166 standard two character identifier for province name. With country code generate primary key of the table';
COMMENT ON COLUMN country_province.country_code IS 'ISO-3166 standard three character identifier for country name. With province code generate primary key of the table';
COMMENT ON COLUMN country_province.description IS 'Detail name of the province';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE country_province ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE country_province ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN country_province.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN country_province.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE country_province ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE country_province ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN country_province.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN country_province.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: country_province ### --
