-- ## Changing table: watercraft_risk_assessment
-- ## Version: bilgePlugFields
-- ## Info: Adding new columns drainplugRemovedAtInspection & watercraftHasDrainplugs
-- ## Adding New Columns ## --

-- ## Adding Column watercraft_has_drainplugs on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ADD COLUMN watercraft_has_drainplugs BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN watercraft_risk_assessment.watercraft_has_drainplugs IS 'Indicator that the inspected watercraft contained drain plugs in Bilge';
-- ## --


-- ## Adding Column drainplug_removed_at_inspection on table watercraft_risk_assessment
ALTER TABLE watercraft_risk_assessment ADD COLUMN drainplug_removed_at_inspection BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN watercraft_risk_assessment.drainplug_removed_at_inspection IS 'With "Pull The Plug" legislation in mind, were the drain plugs removed from vehicle';
-- ## --


-- ## Updating watercraft_risk_assessment ## --
