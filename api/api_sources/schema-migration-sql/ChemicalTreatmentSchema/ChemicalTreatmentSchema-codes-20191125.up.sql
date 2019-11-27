-- ## Changing table: chemical_treatment
-- ## Version: codes
-- ## Info: Adding chemical treatment method and wind direction speed code tables reference to chemical treatment
-- ## Adding New Columns ## --

-- ## Adding Column wind_direction_code_id on table chemical_treatment
ALTER TABLE chemical_treatment ADD COLUMN wind_direction_code_id INT NULL REFERENCES wind_direction_code(wind_direction_code_id) ON DELETE SET NULL;
COMMENT ON COLUMN chemical_treatment.wind_direction_code_id IS 'Foreign key reference to WindDirectionSchema';
-- ## --


-- ## Adding Column chemical_treatment_method_id on table chemical_treatment
ALTER TABLE chemical_treatment ADD COLUMN chemical_treatment_method_id INT NULL REFERENCES chemical_treatment_method(chemical_treatment_method_id) ON DELETE SET NULL;
COMMENT ON COLUMN chemical_treatment.chemical_treatment_method_id IS 'Foreign key reference to Chemical Treatment Method codes';
-- ## --


-- ## Updating chemical_treatment ## --
