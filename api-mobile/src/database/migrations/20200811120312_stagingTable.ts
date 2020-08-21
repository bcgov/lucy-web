import Knex from 'knex';

exports.up = async (knex: Knex) => {
	await knex.raw(`
    set schema 'invasivesbc';
    set search_path = invasivesbc,public;


    -- ### Creating Table: activity_incoming_data ### --

    CREATE TABLE activity_incoming_data ();
    COMMENT ON TABLE activity_incoming_data IS 'Store all incoming data if valid. All mandatory columns must be preset (type & geometry). This is a staging area for further propagation and acts as a source of truth for all field data.';

    ALTER TABLE activity_incoming_data ADD COLUMN activity_incoming_data_id SERIAL PRIMARY KEY;
    COMMENT ON COLUMN activity_incoming_data.activity_incoming_data_id IS 'Auto generated primary key';

    ALTER TABLE activity_incoming_data ADD COLUMN activity_id SERIAL ;
    COMMENT ON COLUMN activity_incoming_data.activity_id IS 'Unique record number. Can occur multiple times with record updates.';

    ALTER TABLE activity_incoming_data ADD COLUMN version INTEGER NULL;
    COMMENT ON COLUMN activity_incoming_data.version IS 'Indicative of the version for each unique record. Calculated server side.';

    ALTER TABLE activity_incoming_data ADD COLUMN activity_type VARCHAR(200) NULL;
    COMMENT ON COLUMN activity_incoming_data.activity_type IS 'Type of record';
    CREATE index type_idx on activity_incoming_data (activity_type);

    ALTER TABLE activity_incoming_data ADD COLUMN activity_sub_type VARCHAR(200) NULL;
    COMMENT ON COLUMN activity_incoming_data.activity_sub_type IS 'Sub Type of record';
    CREATE index sub_type_idx on activity_incoming_data (activity_sub_type);

    ALTER TABLE activity_incoming_data ADD COLUMN received_timestamp timestamp NOT NULL DEFAULT NOW();
    COMMENT ON COLUMN activity_incoming_data.received_timestamp IS 'The date and time data was received and inserted into the database.';

    ALTER TABLE activity_incoming_data ADD COLUMN geom geometry(GeometryCollection,4326) CHECK (st_isValid(geom));
    COMMENT ON COLUMN activity_incoming_data.geom IS 'Geometry collection in Albers projection.';
    CREATE index activity_incoming_data_gist on activity_incoming_data using gist ("geom");

    ALTER TABLE activity_incoming_data ADD COLUMN activity_payload JSONB;
    COMMENT ON COLUMN activity_incoming_data.activity_payload IS 'Raw data upload in compressed JSON format.';


    ALTER TABLE activity_incoming_data ADD COLUMN activity_type_data JSONB;
    COMMENT ON COLUMN activity_incoming_data.activity_type_data IS 'Raw data upload in compressed JSON format.';

    ALTER TABLE activity_incoming_data ADD COLUMN activity_sub_type_data JSONB;
    COMMENT ON COLUMN activity_incoming_data.activity_sub_type_data IS 'Raw data upload in compressed JSON format.';



  `);

};

exports.down = async (knex: Knex) => {
  await knex.raw(`
    set search_path = invasivesbc,public;
    set schema 'invasivesbc';

    drop table if exists activity_incoming_data;
  `);
};
