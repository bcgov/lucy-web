-- ## Reverting table: chemical_treatment
-- ## Version: addMixDeliveryRateColumn
-- ## Info: Adding calibrated mix delivery rate to chemical treatment
-- ## Removing New Columns ## --
ALTER TABLE chemical_treatment DROP COLUMN IF EXISTS mix_delivery_rate;

-- ## Updating chemical_treatment ## --
