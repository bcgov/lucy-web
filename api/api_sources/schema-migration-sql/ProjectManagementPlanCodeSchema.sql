-- ### Creating Table: project_management_plan_code ### --

        
CREATE TABLE project_management_plan_code ();
ALTER TABLE project_management_plan_code ADD COLUMN project_management_plan_code_id SERIAL PRIMARY KEY;
ALTER TABLE project_management_plan_code ADD COLUMN pmp_number VARCHAR(50) NOT NULL UNIQUE;
ALTER TABLE project_management_plan_code ADD COLUMN description VARCHAR(50) NOT NULL;
ALTER TABLE project_management_plan_code ADD COLUMN pmp_holder VARCHAR(50) NOT NULL;
ALTER TABLE project_management_plan_code ADD COLUMN legal_start_date DATE NOT NULL;
ALTER TABLE project_management_plan_code ADD COLUMN legal_end_date DATE NOT NULL;


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE project_management_plan_code IS 'A Pest Management Plan is a treatment plan ID number, which is required for any herbicide treatment on public lands. The PMP Number is required for verifying which herbicidal and chemical treatments are safe and allowable within a specific area.
The Province is divided into a number of zones that allow for and regulate what can be apply on the landscape. The PMP or Pest Management Plan is a document that provides the regulations for a 5 year period. The PMP number (dropdown) is required for each treatment record.';
COMMENT ON COLUMN project_management_plan_code.project_management_plan_code_id IS 'Auto generated primary key. This is auto incremental field';
COMMENT ON COLUMN project_management_plan_code.pmp_number IS 'Unique number associated with Plan';
COMMENT ON COLUMN project_management_plan_code.description IS 'Description of plan';
COMMENT ON COLUMN project_management_plan_code.pmp_holder IS 'Holder of plan';
COMMENT ON COLUMN project_management_plan_code.legal_start_date IS 'Legal start date of plan';
COMMENT ON COLUMN project_management_plan_code.legal_end_date IS 'Legal end data of plan';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE project_management_plan_code ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE project_management_plan_code ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN project_management_plan_code.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN project_management_plan_code.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE project_management_plan_code ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE project_management_plan_code ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN project_management_plan_code.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN project_management_plan_code.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: project_management_plan_code ### --
