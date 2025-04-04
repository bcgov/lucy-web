-- ## Changing table: observer_workflow
-- ## Version: stationInformation
-- ## Info: Adding new column station_information
-- ## Adding New Columns ## --

-- ## Adding Column station_information on table observer_workflow
ALTER TABLE observer_workflow ADD COLUMN station_information VARCHAR(300) NULL;
COMMENT ON COLUMN observer_workflow.station_information IS 'Additional information about the station';
-- ## --