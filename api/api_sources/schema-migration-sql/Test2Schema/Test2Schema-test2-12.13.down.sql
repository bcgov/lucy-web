-- ## Reverting table: sample2_table
-- ## Version: test2
-- ## Info: Test version added
-- ## Removing New Columns ## --
ALTER TABLE sample2_table DROP COLUMN IF EXISTS count;
ALTER TABLE sample2_table DROP COLUMN IF EXISTS top;

-- ## Updating sample2_table ## --
