-- ## Changing table: watercraft_risk_assessment
-- ## Version: urgentApiFixes
-- ## Info: Increasing max char limit for generalComments field, making timestamp optional. Changes needed as temporary measure to accommodate problems in prod.
-- ## Modifying Existing Columns ## --

-- ## Modifying Columns general_comment and timestamp on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ALTER COLUMN general_comment TYPE VARCHAR(300) NULL;
ALTER TABLE watercraft_risk_assessment ALTER COLUMN timestamp SET NOT NULL;
-- ## --


-- ## Downgrading watercraft_risk_assessment ## --
