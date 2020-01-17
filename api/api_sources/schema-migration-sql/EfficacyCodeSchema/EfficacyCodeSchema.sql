-- ### Creating Table: undefined ### --

        
CREATE TABLE undefined ();


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE undefined IS 'Application table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE undefined ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE undefined ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN undefined.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN undefined.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE undefined ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE undefined ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN undefined.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN undefined.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: undefined ### --
