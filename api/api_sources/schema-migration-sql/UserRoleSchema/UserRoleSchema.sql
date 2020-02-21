-- ### Creating Table: user_role ### --

        
CREATE TABLE user_role ();
ALTER TABLE user_role ADD COLUMN user_role_id SERIAL PRIMARY KEY;
ALTER TABLE user_role ADD COLUMN user_id INT NOT NULL REFERENCES application_user(user_id) ON DELETE CASCADE;
ALTER TABLE user_role ADD COLUMN role_code_id INT NOT NULL REFERENCES app_role_code(role_code_id) ON DELETE CASCADE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE user_role IS 'This is join (pivot) table for to store different role associated with an account user. The relation between user and roles are many to many in nature.';
COMMENT ON COLUMN user_role.user_role_id IS 'Auto generated primary key.';
COMMENT ON COLUMN user_role.user_id IS 'Foreign key reference to user table';
COMMENT ON COLUMN user_role.role_code_id IS 'Foreign key reference to role code table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE user_role ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE user_role ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN user_role.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN user_role.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        

 -- ### End: user_role ### --
