-- ## Changing table: chemical_treatment
-- ## Version: addCommentsColumn
-- ## Info: Adding new column to chemical treatment to capture optional free-form comments
-- ## Adding New Columns ## --

-- ## Adding Column additional_comments on table chemical_treatment
ALTER TABLE chemical_treatment ADD COLUMN additional_comments VARCHAR(500) NULL;
COMMENT ON COLUMN chemical_treatment.additional_comments IS 'Free-form comments added by chemical treatment provider';
-- ## --


-- ## Updating chemical_treatment ## --
