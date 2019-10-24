-- ## Reverting table: sample2_table
-- ## Version: test
-- ## Info: Test version added
-- ## Removing New Columns ## --
ALTER TABLE sample2_table DROP COLUMN IF EXISTS sample_address;
ALTER TABLE sample2_table DROP COLUMN IF EXISTS tag;

-- ## Updating sample2_table ## --
