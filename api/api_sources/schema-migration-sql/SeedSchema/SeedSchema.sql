-- ### Creating Table: app_seed_table ### --

        
CREATE TABLE app_seed_table ();
ALTER TABLE app_seed_table ADD COLUMN seed_id SERIAL PRIMARY KEY;
ALTER TABLE app_seed_table ADD COLUMN reference VARCHAR(30) NOT NULL UNIQUE;
ALTER TABLE app_seed_table ADD COLUMN seed_target VARCHAR(100) NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE app_seed_table IS 'Table to store seed entries';
COMMENT ON COLUMN app_seed_table.seed_id IS 'Auto generated sequential primary key column.';
COMMENT ON COLUMN app_seed_table.reference IS 'Reference to the seed file';
COMMENT ON COLUMN app_seed_table.seed_target IS 'Name of the target schema';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE app_seed_table ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE app_seed_table ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN app_seed_table.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN app_seed_table.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE app_seed_table ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE app_seed_table ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN app_seed_table.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN app_seed_table.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: app_seed_table ### --
