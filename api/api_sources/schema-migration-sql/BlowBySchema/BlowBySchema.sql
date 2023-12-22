-- ### Creating Table: blow_by ### --

        
CREATE TABLE blow_by ();
ALTER TABLE blow_by ADD COLUMN blow_by_id SERIAL PRIMARY KEY;
ALTER TABLE blow_by ADD COLUMN blow_by_time VARCHAR(100) NULL;
ALTER TABLE blow_by ADD COLUMN watercraft_complexity VARCHAR(100) NULL;
ALTER TABLE blow_by ADD COLUMN reported_to_rapp BOOLEAN NOT NULL DEFAULT false;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE blow_by IS 'BlowBy table';
COMMENT ON COLUMN blow_by.blow_by_id IS 'Auto generated primary key';
COMMENT ON COLUMN blow_by.blow_by_time IS 'Time of blow by';
COMMENT ON COLUMN blow_by.watercraft_complexity IS 'Watercraft complexity';
COMMENT ON COLUMN blow_by.reported_to_rapp IS 'Reported to rapp';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE blow_by ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE blow_by ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN blow_by.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN blow_by.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE blow_by ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE blow_by ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN blow_by.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN blow_by.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: blow_by ### --
