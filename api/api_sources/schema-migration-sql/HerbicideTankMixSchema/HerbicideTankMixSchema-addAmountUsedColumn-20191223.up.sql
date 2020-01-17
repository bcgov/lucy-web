-- ## Changing table: herbicide_tank_mix
-- ## Version: addAmountUsedColumn
-- ## Info: Adding amount_used column in place of dilution rate. This may only be temporary
-- ## Adding New Columns ## --

-- ## Adding Column amount_used on table herbicide_tank_mix
ALTER TABLE herbicide_tank_mix ADD COLUMN amount_used NUMERIC(6,3);
COMMENT ON COLUMN herbicide_tank_mix.amount_used IS 'Field to store volume of specific herbicide added to a tank mix';
-- ## --


-- ## Updating herbicide_tank_mix ## --
