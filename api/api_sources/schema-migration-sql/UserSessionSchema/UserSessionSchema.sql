-- ### Creating Table: user_session ### --

        
CREATE TABLE user_session ();
ALTER TABLE user_session ADD COLUMN session_id SERIAL PRIMARY KEY;
ALTER TABLE user_session ADD COLUMN last_login_at TIMESTAMP NULL;
ALTER TABLE user_session ADD COLUMN token VARCHAR(1000) NULL;
ALTER TABLE user_session ADD COLUMN token_expiry TIMESTAMP NULL;
ALTER TABLE user_session ADD COLUMN token_lifetime INT NULL;
ALTER TABLE user_session ADD COLUMN last_active_at TIMESTAMP NULL;
ALTER TABLE user_session ADD COLUMN user_id INT NOT NULL REFERENCES application_user(user_id) ON DELETE CASCADE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE user_session IS 'User session information. This table is maintain all session of user.';
COMMENT ON COLUMN user_session.session_id IS 'Auto generated primary key';
COMMENT ON COLUMN user_session.last_login_at IS 'Last login timestamp';
COMMENT ON COLUMN user_session.token IS 'Keyclock token of the user';
COMMENT ON COLUMN user_session.token_expiry IS 'Keyclock token expiry timestamp';
COMMENT ON COLUMN user_session.token_lifetime IS 'Life time of KC token in sec';
COMMENT ON COLUMN user_session.last_active_at IS 'Timestamp to check last activity of user';
COMMENT ON COLUMN user_session.user_id IS 'Foreign key reference to user table. Owner of the session.';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE user_session ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE user_session ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN user_session.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN user_session.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        

 -- ### End: user_session ### --
