-- ### Creating Table: species_distribution_code ### --

        
CREATE TABLE species_distribution_code ();
ALTER TABLE species_distribution_code ADD COLUMN species_distribution_code_id INT NOT NULL PRIMARY KEY;
ALTER TABLE species_distribution_code ADD COLUMN description VARCHAR(100) NOT NULL;
ALTER TABLE species_distribution_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE species_distribution_code IS 'Distribution code table of species for an observation';
COMMENT ON COLUMN species_distribution_code.species_distribution_code_id IS 'Identifier as code';
COMMENT ON COLUMN species_distribution_code.description IS 'Description of distribution code';
COMMENT ON COLUMN species_distribution_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE species_distribution_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE species_distribution_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN species_distribution_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN species_distribution_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE species_distribution_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE species_distribution_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN species_distribution_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN species_distribution_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: species_distribution_code ### --
