-- ## Reverting table: herbicide_tank_mix
-- ## Version: addAmountUsedColumn
-- ## Info: Adding amount_used column in place of dilution rate. This may only be temporary
-- ## Removing New Columns ## --
ALTER TABLE herbicide_tank_mix DROP COLUMN IF EXISTS amount_used;

-- ## Updating herbicide_tank_mix ## --
