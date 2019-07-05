-- ### Creating Table ### --

        
CREATE TABLE sample2_table ();
ALTER TABLE sample2_table ADD COLUMN sample_id SERIAL PRIMARY KEY;
ALTER TABLE sample2_table ADD COLUMN sample_name VARCHAR(20) NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE sample2_table IS 'Sample application table';
COMMENT ON COLUMN sample2_table.sample_id IS 'Sample column pk';
COMMENT ON COLUMN sample2_table.sample_name IS 'Name of the sample';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE sample2_table ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE sample2_table ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN sample2_table.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN sample2_table.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        

