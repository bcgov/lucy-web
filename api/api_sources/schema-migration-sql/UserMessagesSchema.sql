-- ### Creating Table: user_message ### --

        
CREATE TABLE user_message ();
ALTER TABLE user_message ADD COLUMN message_id SERIAL PRIMARY KEY;
ALTER TABLE user_message ADD COLUMN title VARCHAR(200) NULL;
ALTER TABLE user_message ADD COLUMN body VARCHAR(1000) NULL;
ALTER TABLE user_message ADD COLUMN message_type SMALLINT NOT NULL DEFAULT 0;
ALTER TABLE user_message ADD COLUMN message_status SMALLINT NOT NULL DEFAULT 0;
ALTER TABLE user_message ADD COLUMN receiver_user_id INT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE user_message ADD COLUMN creator_user_id INT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE user_message IS 'Table to store user messages. Messages can be created by system or other user. This messages will be displayed as notification.';
COMMENT ON COLUMN user_message.message_id IS 'Auto generated primary key';
COMMENT ON COLUMN user_message.title IS 'Title of the messages.';
COMMENT ON COLUMN user_message.body IS 'Message body';
COMMENT ON COLUMN user_message.message_type IS 'Integer enum value to specify message type. Currently types are managed by application';
COMMENT ON COLUMN user_message.message_status IS 'Integer enum value to specify message status. Currently types are managed by application';
COMMENT ON COLUMN user_message.receiver_user_id IS 'FOREIGN KEY reference to User table. This column will store receiver of the message';
COMMENT ON COLUMN user_message.creator_user_id IS 'FOREIGN KEY reference to User table. This column will store creator of the message ';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE user_message ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE user_message ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN user_message.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN user_message.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        

 -- ### End: user_message ### --
