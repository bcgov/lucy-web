-- ## Reverting table: watercraft_risk_assessment
-- ## Version: numberOfPeopleInParty
-- ## Info: Adding new column numberOfPeopleInParty
-- ## Removing New Columns ## --
ALTER TABLE watercraft_risk_assessment DROP COLUMN IF EXISTS number_of_people_in_party;

-- ## Updating watercraft_risk_assessment ## --
