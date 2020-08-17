CREATE OR REPLACE VIEW observation_common_fields_view as (
select 
'banana' as activity_id,
'banana' as observation_type,
'banana' as negative_observation_ind,
'banana' as aquatic_observation_ind,
'banana' as primary_user_last_name,
'banana' as secondary_user_first_name,
'banana' as secondary_user_last_name,
'banana' as species,
'banana' as primary_file_id,
'banana' as secondary_file_id,
'banana' as location_comment,
'banana' as general_observation_comment,
'banana' as sample_taken_ind,
'banana' as sample_label_number

from activity_incoming_data
where activity_incoming_data.activity_type = 'Observation'
)
COMMENT ON VIEW observation_common_fields_view IS 'View on fields common to all types of observations, with table activity_incoming_data as source.';
