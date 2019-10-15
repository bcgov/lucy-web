-- ### Creating Table: application_event ### --

        
CREATE TABLE application_event ();
ALTER TABLE application_event ADD COLUMN application_event_id SERIAL PRIMARY KEY;
ALTER TABLE application_event ADD COLUMN event_type INT NOT NULL;
ALTER TABLE application_event ADD COLUMN event_source VARCHAR(1000) NULL;
ALTER TABLE application_event ADD COLUMN event_note VARCHAR(200) NULL;
ALTER TABLE application_event ADD COLUMN session_id INT NULL REFERENCES user_session(session_id) ON DELETE SET NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE application_event IS 'Table to log all application events. Event such as application bootstrapping, error, warning, info. Content of this table helps to monitor and debugging.';
COMMENT ON COLUMN application_event.application_event_id IS 'Auto generated primary key';
COMMENT ON COLUMN application_event.event_type IS 'Type enum column. Enum values specify event type. Typical event types are Error, Info, Warning. No separate code tables for business exists for type. App system is managing the values.';
COMMENT ON COLUMN application_event.event_source IS 'Source information of event. Source will contain information like Source File/Method/Activity';
COMMENT ON COLUMN application_event.event_note IS 'Additional note or log data attached with event';
COMMENT ON COLUMN application_event.session_id IS 'User session attached to the event.';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE application_event ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE application_event ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN application_event.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN application_event.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        

 -- ### End: application_event ### --
