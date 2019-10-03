-- ### Creating Table: species_density_code ### --

        
CREATE TABLE species_density_code ();
ALTER TABLE species_density_code ADD COLUMN species_density_code_id SERIAL PRIMARY KEY;
ALTER TABLE species_density_code ADD COLUMN density_code VARCHAR(5) NOT NULL UNIQUE;
ALTER TABLE species_density_code ADD COLUMN description VARCHAR(100) NULL;
ALTER TABLE species_density_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE species_density_code IS 'Density enum code table for a species of observation';
COMMENT ON COLUMN species_density_code.species_density_code_id IS 'Auto generated primary key';
COMMENT ON COLUMN species_density_code.density_code IS 'Density code values based on species present on location';
COMMENT ON COLUMN species_density_code.description IS 'Description of code';
COMMENT ON COLUMN species_density_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE species_density_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE species_density_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN species_density_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN species_density_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE species_density_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE species_density_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN species_density_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN species_density_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: species_density_code ### --
