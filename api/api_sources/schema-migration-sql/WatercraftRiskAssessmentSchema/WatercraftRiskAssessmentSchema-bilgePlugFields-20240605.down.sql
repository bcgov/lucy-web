-- ## Reverting table: watercraft_risk_assessment
-- ## Version: bilgePlugFields
-- ## Info: Adding new columns drainplugRemovedAtInspection & watercraftHasDrainplugs
-- ## Removing New Columns ## --
ALTER TABLE watercraft_risk_assessment DROP COLUMN IF EXISTS watercraft_has_drainplugs;
ALTER TABLE watercraft_risk_assessment DROP COLUMN IF EXISTS drainplug_removed_at_inspection;

-- ## Updating watercraft_risk_assessment ## --
