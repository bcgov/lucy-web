-- ### Creating Table: user_session_activity ### --

        
CREATE TABLE user_session_activity ();
ALTER TABLE user_session_activity ADD COLUMN user_session_activity_id SERIAL PRIMARY KEY;
ALTER TABLE user_session_activity ADD COLUMN session_activity_info VARCHAR(500);
ALTER TABLE user_session_activity ADD COLUMN session_activity_code_id INT NOT NULL REFERENCES session_activity_code(session_activity_code_id) ON DELETE SET NULL;
ALTER TABLE user_session_activity ADD COLUMN session_id INT NOT NULL REFERENCES user_session(session_id) ON DELETE CASCADE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE user_session_activity IS 'This table is used to hold user session activities. Activities are defined by session activity code table';
COMMENT ON COLUMN user_session_activity.user_session_activity_id IS 'Auto generated primary key';
COMMENT ON COLUMN user_session_activity.session_activity_info IS 'Additional information on activity';
COMMENT ON COLUMN user_session_activity.session_activity_code_id IS 'Foreign key reference to session_activity_code table.';
COMMENT ON COLUMN user_session_activity.session_id IS 'Foreign key reference to user session table';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE user_session_activity ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE user_session_activity ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN user_session_activity.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN user_session_activity.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        

 -- ### End: user_session_activity ### --
