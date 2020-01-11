-- ### Creating Table: herbicide ### --

        
CREATE TABLE herbicide ();
ALTER TABLE herbicide ADD COLUMN herbicide_id SERIAL PRIMARY KEY;
ALTER TABLE herbicide ADD COLUMN herbicide_code VARCHAR(20) NOT NULL UNIQUE;
ALTER TABLE herbicide ADD COLUMN composite_name VARCHAR(100) NOT NULL UNIQUE;
ALTER TABLE herbicide ADD COLUMN active_ingredient VARCHAR(50);
ALTER TABLE herbicide ADD COLUMN trade_name VARCHAR(50);
ALTER TABLE herbicide ADD COLUMN pmra_reg_num INT NOT NULL UNIQUE;
ALTER TABLE herbicide ADD COLUMN formulation VARCHAR(20);
ALTER TABLE herbicide ADD COLUMN application_rate NUMERIC(5,3);
ALTER TABLE herbicide ADD COLUMN application_units VARCHAR(10);


        
-- ### Creating Comments on table ### --

        
COMMENT ON TABLE herbicide IS 'Table to store herbicide information';
COMMENT ON COLUMN herbicide.herbicide_id IS 'Auto generated sequential primary key column.';
COMMENT ON COLUMN herbicide.herbicide_code IS 'Code associated with herbicide. This code is used to uniquely identify with application domain';
COMMENT ON COLUMN herbicide.composite_name IS 'Name of herbicide to be displayed in herbicide dropdown menu';
COMMENT ON COLUMN herbicide.active_ingredient IS 'Active ingredient contained in herbicide';
COMMENT ON COLUMN herbicide.trade_name IS 'Trade name associated with herbicide';
COMMENT ON COLUMN herbicide.pmra_reg_num IS 'Pest Management Regulatory Agency registration number of herbicide';
COMMENT ON COLUMN herbicide.formulation IS 'String value describing the nature of the herbicide';
COMMENT ON COLUMN herbicide.application_rate IS 'Manufacturer-recommended application rate of herbicide';
COMMENT ON COLUMN herbicide.application_units IS 'Units used to describe application rate of herbicide';


        
-- ### Creating Timestamp column ### --

        
ALTER TABLE herbicide ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE herbicide ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
COMMENT ON COLUMN herbicide.created_at IS 'Timestamp column to check creation time of record';
COMMENT ON COLUMN herbicide.updated_at IS 'Timestamp column to check modify time of record';

        
-- ### Creating User Audit Columns ### --

        
ALTER TABLE herbicide ADD COLUMN updated_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
ALTER TABLE herbicide ADD COLUMN created_by_user_id INT NULL DEFAULT NULL REFERENCES application_user(user_id) ON DELETE SET NULL;
COMMENT ON COLUMN herbicide.updated_by_user_id IS 'Audit column to track creator';
COMMENT ON COLUMN herbicide.created_by_user_id IS 'Audit column to track modifier';
 -- ### End: herbicide ### --
