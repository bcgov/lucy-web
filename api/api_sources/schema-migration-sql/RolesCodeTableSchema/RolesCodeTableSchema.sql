-- ### Creating Table: app_role_code ### --

        
CREATE TABLE app_role_code ();
ALTER TABLE app_role_code ADD COLUMN role_code_id SERIAL PRIMARY KEY;
ALTER TABLE app_role_code ADD COLUMN role_code VARCHAR(10) NOT NULL UNIQUE;
ALTER TABLE app_role_code ADD COLUMN role VARCHAR(50) NULL;
ALTER TABLE app_role_code ADD COLUMN description VARCHAR(300) NULL;
ALTER TABLE app_role_code ADD COLUMN active_ind BOOLEAN NOT NULL DEFAULT TRUE;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE app_role_code IS 'This table holds definition of different user roles of the system along with cross domain code.';
COMMENT ON COLUMN app_role_code.role_code_id IS 'Auto generated primary key.';
COMMENT ON COLUMN app_role_code.role_code IS 'Cross domain code to uniquely identify any role';
COMMENT ON COLUMN app_role_code.role IS 'Role description in words';
COMMENT ON COLUMN app_role_code.description IS 'Detail description of of different roles and access level and functional capability';
COMMENT ON COLUMN app_role_code.active_ind IS 'Indicator to check active status of code';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE app_role_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE app_role_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN app_role_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN app_role_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --
 -- ### End: app_role_code ### --
