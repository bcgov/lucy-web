-- ## Changing table: observer_workflow
-- ## Version: stationInformation
-- ## Info: Adding new column station_information
-- ## Removing Columns ## --

-- ## Removing Column station_information from table observer_workflow
ALTER TABLE observer_workflow DROP COLUMN IF EXISTS station_information;
-- ## --