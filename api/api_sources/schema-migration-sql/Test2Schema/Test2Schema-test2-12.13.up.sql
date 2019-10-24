-- ## Changing table: sample2_table
-- ## Version: test2
-- ## Info: Test version added
-- ## Adding New Columns ## --

## -- Adding Column count on table sample2_table
ALTER TABLE sample2_table ADD COLUMN count VARCHAR(20) NOT NULL;
COMMENT ON COLUMN sample2_table.count IS 'Name of the sample'
 ## --


## -- Adding Column top on table sample2_table
ALTER TABLE sample2_table ADD COLUMN top VARCHAR(200) NOT NULL;
COMMENT ON COLUMN sample2_table.top IS 'Name of the sample'
 ## --


-- ## Updating sample2_table ## --
