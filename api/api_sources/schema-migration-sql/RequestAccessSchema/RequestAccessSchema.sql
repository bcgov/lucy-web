-- ### Creating Table: access_request ### --

        
CREATE TABLE access_request ();
ALTER TABLE access_request ADD COLUMN request_id SERIAL PRIMARY KEY;
ALTER TABLE access_request ADD COLUMN request_note VARCHAR(500) NULL;
ALTER TABLE access_request ADD COLUMN status INT NULL;
ALTER TABLE access_request ADD COLUMN approver_note VARCHAR(500) NULL;
ALTER TABLE access_request ADD COLUMN requested_role_code_id INT NOT NULL REFERENCES app_role_code(role_code_id) ON DELETE SET NULL;
ALTER TABLE access_request ADD COLUMN requester_user_id INT NOT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE access_request ADD COLUMN approver_user_id INT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE access_request IS 'Table to store requests of access level change for a user. Request will be handle by admin';
COMMENT ON COLUMN access_request.request_id IS 'Auto generated primary key';
COMMENT ON COLUMN access_request.request_note IS 'Note attached with access request.';
COMMENT ON COLUMN access_request.status IS 'This column will store status of the request. This is integer enum. Values managed by application.';
COMMENT ON COLUMN access_request.approver_note IS 'Note from approver';
COMMENT ON COLUMN access_request.requested_role_code_id IS 'FOREIGN KEY reference to Role Code Table. This value specify requested access type';
COMMENT ON COLUMN access_request.requester_user_id IS 'FOREIGN KEY reference to User table to store requester id';
COMMENT ON COLUMN access_request.approver_user_id IS 'FOREIGN KEY reference to User table to store approver id';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE access_request ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE access_request ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN access_request.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN access_request.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        

 -- ### End: access_request ### --
