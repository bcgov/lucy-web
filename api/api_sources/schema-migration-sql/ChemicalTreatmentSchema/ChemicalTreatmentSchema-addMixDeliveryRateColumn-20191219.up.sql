-- ## Changing table: chemical_treatment
-- ## Version: addMixDeliveryRateColumn
-- ## Info: Adding calibrated mix delivery rate to chemical treatment
-- ## Adding New Columns ## --

-- ## Adding Column mix_delivery_rate on table chemical_treatment
ALTER TABLE chemical_treatment ADD COLUMN mix_delivery_rate INT NULL;
COMMENT ON COLUMN chemical_treatment.mix_delivery_rate IS 'Delivery rate of herbicide tank mix in L/ha';
-- ## --


-- ## Updating chemical_treatment ## --
