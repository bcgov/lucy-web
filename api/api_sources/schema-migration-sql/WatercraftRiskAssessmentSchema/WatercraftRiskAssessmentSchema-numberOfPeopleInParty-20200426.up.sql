-- ## Changing table: watercraft_risk_assessment
-- ## Version: numberOfPeopleInParty
-- ## Info: Adding new column numberOfPeopleInParty
-- ## Adding New Columns ## --

-- ## Adding Column number_of_people_in_party on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ADD COLUMN number_of_people_in_party INT NULL DEFAULT 1;
COMMENT ON COLUMN watercraft_risk_assessment.number_of_people_in_party IS 'Number of peoples in inspected boats';
-- ## --


-- ## Updating watercraft_risk_assessment ## --
