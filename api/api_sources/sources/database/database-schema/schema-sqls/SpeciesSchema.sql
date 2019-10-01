-- ### Creating Table: species ### --

        
CREATE TABLE species ();
ALTER TABLE species ADD COLUMN species_id SERIAL PRIMARY KEY;
ALTER TABLE species ADD COLUMN map_code VARCHAR(10) NOT NULL UNIQUE;
ALTER TABLE species ADD COLUMN early_detection_ind BOOLEAN DEFAULT FALSE;
ALTER TABLE species ADD COLUMN containment_species SMALLINT NULL;
ALTER TABLE species ADD COLUMN containment_species_spatial_ref SMALLINT NULL;
ALTER TABLE species ADD COLUMN species_code VARCHAR(10) NOT NULL;
ALTER TABLE species ADD COLUMN genus_code VARCHAR(5) NOT NULL;
ALTER TABLE species ADD COLUMN common_name VARCHAR(100) NOT NULL;
ALTER TABLE species ADD COLUMN latin_name VARCHAR(100) NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE species IS 'Universal species table. A species is often defined as a group of individuals that actually or potentially interbreed in nature. Taxonomic Level: Domain, Kingdom, Phylum, Class, Order, Family,Genus, Species';
COMMENT ON COLUMN species.species_id IS 'Auto generated primary key';
COMMENT ON COLUMN species.map_code IS 'Code associated with species. This code is used to uniquely identify with application domain';
COMMENT ON COLUMN species.early_detection_ind IS 'This indicator indicates early detection of species';
COMMENT ON COLUMN species.containment_species IS 'Code to check species containment level';
COMMENT ON COLUMN species.containment_species_spatial_ref IS 'Containment spatial reference of species';
COMMENT ON COLUMN species.species_code IS 'Species Code. String enum to identify species with application domain';
COMMENT ON COLUMN species.genus_code IS 'Latin Genus name of the species (first 3 characters)';
COMMENT ON COLUMN species.common_name IS 'Common or popular name of the species';
COMMENT ON COLUMN species.latin_name IS 'Latin or scientific name of the species';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE species ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE species ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN species.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN species.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE species ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE species ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN species.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN species.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: species ### --
