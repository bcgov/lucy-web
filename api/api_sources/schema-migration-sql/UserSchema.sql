-- ### Creating Table: application_user ### --

        
CREATE TABLE application_user ();
ALTER TABLE application_user ADD COLUMN user_id SERIAL PRIMARY KEY;
ALTER TABLE application_user ADD COLUMN first_name VARCHAR(100) NULL;
ALTER TABLE application_user ADD COLUMN last_name VARCHAR(100) NULL;
ALTER TABLE application_user ADD COLUMN email VARCHAR(300) NOT NULL UNIQUE;
ALTER TABLE application_user ADD COLUMN preferred_username VARCHAR(300) NOT NULL UNIQUE;
ALTER TABLE application_user ADD COLUMN account_status SMALLINT DEFAULT 1;
ALTER TABLE application_user ADD COLUMN expiry_date DATE NULL;
ALTER TABLE application_user ADD COLUMN activation_status SMALLINT DEFAULT 1;
ALTER TABLE application_user ADD COLUMN active_session_id INT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE application_user IS 'User of the application is a person with valid IDR or BCeID. Default role of the user is Viewer of InvasiveBC data records. Other typical user types are admin, subject matter expert (sme/ or data editor)';
COMMENT ON COLUMN application_user.user_id IS 'Auto generated primary key. Uniquely identify user';
COMMENT ON COLUMN application_user.first_name IS 'First name of the user';
COMMENT ON COLUMN application_user.last_name IS 'Last name of the user';
COMMENT ON COLUMN application_user.email IS 'Email address of user';
COMMENT ON COLUMN application_user.preferred_username IS 'IDR of BCeID associated with user';
COMMENT ON COLUMN application_user.account_status IS 'Status of user account. This application level enum flag values. 0 => Inactive, 1 => Active, 2 => Suspended. Currently this values are managed by application, no code table for business';
COMMENT ON COLUMN application_user.expiry_date IS 'Expiry date of the account';
COMMENT ON COLUMN application_user.activation_status IS 'Flag to check account is active or not';
COMMENT ON COLUMN application_user.active_session_id IS 'Reference to active session table. This is non referential colum to create soft link to user_session table. This column will used to keep track current active session of the user';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE application_user ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE application_user ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN application_user.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN application_user.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        

 -- ### End: application_user ### --
