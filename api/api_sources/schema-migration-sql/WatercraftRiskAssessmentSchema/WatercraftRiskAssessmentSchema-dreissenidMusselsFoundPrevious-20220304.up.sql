-- ## Changing table: watercraft_risk_assessment
-- ## Version: dreissenidMusselsFoundPrevious
-- ## Info: Adding column DreissenidMusselsFoundPrevious
-- ## Adding New Columns ## --

-- ## Adding Column dreissenid_mussels_found_previous on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ADD COLUMN dreissenid_mussels_found_previous BOOLEAN NOT NULL DEFAULT FALSE;
-- ## --
