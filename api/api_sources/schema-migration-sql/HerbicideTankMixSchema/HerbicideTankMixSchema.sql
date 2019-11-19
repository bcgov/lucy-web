-- ### Creating Table: herbicide_tank_mix ### --

        
CREATE TABLE herbicide_tank_mix ();
ALTER TABLE herbicide_tank_mix ADD COLUMN herbicide_tank_mix_id SERIAL PRIMARY KEY;
ALTER TABLE herbicide_tank_mix ADD COLUMN application_rate NUMERIC(6,3);
ALTER TABLE herbicide_tank_mix ADD COLUMN dilution_rate NUMERIC(6,3);
ALTER TABLE herbicide_tank_mix ADD COLUMN herbicide_id INT NULL REFERENCES herbicide(herbicide_id) ON DELETE SET NULL;
ALTER TABLE herbicide_tank_mix ADD COLUMN chemical_treatment_id INT NULL REFERENCES chemical_treatment(chemical_treatment_id) ON DELETE CASCADE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE herbicide_tank_mix IS 'Record of one herbicide included in the tank mix used for chemical treatment application. A tank mix includes one or more herbicides.';
COMMENT ON COLUMN herbicide_tank_mix.herbicide_tank_mix_id IS 'Auto generated primary key. This is auto incremental field';
COMMENT ON COLUMN herbicide_tank_mix.application_rate IS 'Application rate of herbicide to treatment area, in units of L/hectare';
COMMENT ON COLUMN herbicide_tank_mix.dilution_rate IS 'Dilution rate of herbicide, as percentage of concentrate to total volume';
COMMENT ON COLUMN herbicide_tank_mix.herbicide_id IS 'Foreign key reference to herbicide code table';
COMMENT ON COLUMN herbicide_tank_mix.chemical_treatment_id IS 'Foreign key reference to chemical treatment table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE herbicide_tank_mix ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE herbicide_tank_mix ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN herbicide_tank_mix.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN herbicide_tank_mix.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE herbicide_tank_mix ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE herbicide_tank_mix ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN herbicide_tank_mix.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN herbicide_tank_mix.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: herbicide_tank_mix ### --
