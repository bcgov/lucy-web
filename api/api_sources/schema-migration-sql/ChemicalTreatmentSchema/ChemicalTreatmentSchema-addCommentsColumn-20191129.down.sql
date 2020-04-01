-- ## Reverting table: chemical_treatment
-- ## Version: addCommentsColumn
-- ## Info: Adding new column to chemical treatment to capture optional free-form comments
-- ## Removing New Columns ## --
ALTER TABLE chemical_treatment DROP COLUMN IF EXISTS additional_comments;

-- ## Updating chemical_treatment ## --
