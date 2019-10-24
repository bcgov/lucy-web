-- ## Changing table: sample2_table
-- ## Version: test
-- ## Info: Test version added
-- ## Adding New Columns ## --

## -- Adding Column sample_address on table sample2_table
ALTER TABLE sample2_table ADD COLUMN sample_address VARCHAR(20) NOT NULL;
COMMENT ON COLUMN sample2_table.sample_address IS 'Name of the sample'
 ## --


## -- Adding Column tag on table sample2_table
ALTER TABLE sample2_table ADD COLUMN tag VARCHAR(200) NOT NULL;
COMMENT ON COLUMN sample2_table.tag IS 'Name of the sample'
 ## --


-- ## Updating sample2_table ## --
