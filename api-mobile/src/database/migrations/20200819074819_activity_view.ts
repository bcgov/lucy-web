import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {

	await knex.raw(`
	    set schema 'invasivesbc';
	    set search_path = invasivesbc,public;

	CREATE OR REPLACE VIEW activity_common_fields_view as (
	select
	activity_id,
	activity_type,
	activity_sub_type,
	cast(activity_payload -> 'locationAndGeometry' ->> 'anchorPointX' as decimal) as anchor_point_x,
	cast(activity_payload -> 'locationAndGeometry' ->> 'anchorPointY' as decimal) as anchor_point_y,
	received_timestamp

	from activity_incoming_data
	);

	COMMENT ON VIEW activity_common_fields_view IS 'View on fields common to all types of activities, with table activity_incoming_data as source.';






    `)

}


export async function down(knex: Knex): Promise<void> {
	await knex.raw(`
		    set schema 'invasivesbc';
		    set search_path = invasivesbc,public;
		    drop view if exists activity_common_fields_view;
	    `)
}

