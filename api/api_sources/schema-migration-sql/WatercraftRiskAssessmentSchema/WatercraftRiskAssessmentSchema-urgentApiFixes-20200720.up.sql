-- ## Changing table: watercraft_risk_assessment
-- ## Version: urgentApiFixes
-- ## Info: Increasing max char limit for generalComments field, making timestamp optional. Changes needed as temporary measure to accommodate problems in prod.
-- ## Modifying Existing Columns ## --

-- ## Modifying Columns general_comment and timestamp on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ALTER COLUMN general_comment TYPE VARCHAR(1000);
ALTER TABLE watercraft_risk_assessment ALTER COLUMN timestamp DROP NOT NULL;
-- ## --


-- ## Updating watercraft_risk_assessment ## --
