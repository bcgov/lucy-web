

SELECT wra.watercraft_risk_assessment_id,
       au.preferred_username,
       ow.station,
       to_char(ow."date", 'YYYY/MM/DD hh:mm:ss') AS "date",
       ow.start_time,
       ow.end_time,
       ow.k9_on_shift_ind,
       ow.motorized_blow_bys_counter,
       ow.non_motorized_blow_bys_counter,
       ow.boats_inspected_ind,
       ow.shift_start_comment,
       ow.shift_end_comment,
       to_char(wra."timestamp", 'YYYY/MM/DD hh:mm:ss') AS "timestamp",
       wra.passport_holder_ind,
       wra.passport_number,
       to_char(wra."timestamp", 'YYYY/MM/DD hh:mm:ss') AS "timestamp",
       wra.launched_outside_bc_ind,
       wra.decontamination_performed_ind,
       wra.decontamination_reference,
       wra.province_code,
       wra.country_code,
       wra.non_motorized_counter,
       wra.simple_counter,
       wra.complex_counter,
       wra.very_complex_count,
       wra.number_of_people_in_party,
       wra.commercially_hauled_ind,
       wra.previous_ais_knowledge_ind,
       wra.previous_ais_knowledge_source_code_id,
       wra.previous_inspection_ind,
       wra.previous_inspection_source_code_id,
       wra.previous_inspection_days_count ,
       
       ---build previous journey details here
	pwj_1.water_body_id as previous_journey_water_body_id_1,
	pwj_2.water_body_id as previous_journey_water_body_id_2,
	pwj_3.water_body_id as previous_journey_water_body_id_3,
 
       wra.previous_dry_storage_ind,
       wra.unknown_previous_water_body_ind,
       wra.commercial_manufacturer_as_previous_water_body_ind ,
       
       --destination journey details go here
	dwj_1.water_body_id as destination_journey_water_body_id_1,
	dwj_2.water_body_id as destination_journey_water_body_id_2,
	dwj_3.water_body_id as destination_journey_water_body_id_3,
 
       wra.destination_dry_storage_ind,
       wra.k9_inspection_ind,
       wra.unknown_destination_water_body_ind,
       wra.commercial_manufacturer_as_destination_water_body_ind,
       wra.marine_species_found_ind,
       wra.aquatic_plants_found_ind,
       wra.marine_mussel_found_ind,
       wra.adult_dreissenidae_found_ind,
       wra.high_risk_area_ind,
       wra.high_risk_ais_ind,
       wra.high_risk_assessment_id,
       hra.watercraft_registration,
       hra.clean_drain_dry_after_inspection_ind,
       hra.standing_water_present_ind,
       hra.standing_water_location_code_id,
       hra.adult_dreissenidae_mussel_found_ind,
       hra.adult_mussels_location_code_id,
       hra.quarantine_period_issued_ind,
       hra.decontamination_performed_ind,
       hra.decontamination_order_issued_ind,
       hra.seal_issued_ind,
       hra.decontamination_reference,
       hra.decontamination_order_number,
       hra.seal_number,
       hra.other_inspection_findings,
       hra.general_comments,
       to_char(hra.created_at, 'YYYY/MM/DD hh:mm:ss') AS created_at,
       to_char(hra.updated_at, 'YYYY/MM/DD hh:mm:ss') AS updated_at,
       hra.updated_by_user_id,
       hra.created_by_user_id
FROM watercraft_risk_assessment wra

--joins for previous journey water bodies
LEFT JOIN (select watercraft_journey_id, water_body_id, watercraft_risk_assessment_id, row_number() over (order by watercraft_journey_id asc) from watercraft_journey where journey_type = 1) as pwj_1 ON wra.watercraft_risk_assessment_id = pwj_1.watercraft_risk_assessment_id and pwj_1.row_number = 1
LEFT JOIN (select watercraft_journey_id, water_body_id, watercraft_risk_assessment_id, row_number() over (order by watercraft_journey_id asc) from watercraft_journey where journey_type = 1) as pwj_2 ON wra.watercraft_risk_assessment_id = pwj_2.watercraft_risk_assessment_id and pwj_2.row_number = 2
LEFT JOIN (select watercraft_journey_id, water_body_id, watercraft_risk_assessment_id, row_number() over (order by watercraft_journey_id asc) from watercraft_journey where journey_type = 1) as pwj_3 ON wra.watercraft_risk_assessment_id = pwj_3.watercraft_risk_assessment_id and pwj_3.row_number = 3

--joins for destination journey water bodies
LEFT JOIN (select watercraft_journey_id, water_body_id, watercraft_risk_assessment_id, row_number() over (order by watercraft_journey_id asc) from watercraft_journey where journey_type = 2) as dwj_1 ON wra.watercraft_risk_assessment_id = dwj_1.watercraft_risk_assessment_id and dwj_1.row_number = 1
LEFT JOIN (select watercraft_journey_id, water_body_id, watercraft_risk_assessment_id, row_number() over (order by watercraft_journey_id asc) from watercraft_journey where journey_type = 2) as dwj_2 ON wra.watercraft_risk_assessment_id = dwj_2.watercraft_risk_assessment_id and dwj_2.row_number = 2
LEFT JOIN (select watercraft_journey_id, water_body_id, watercraft_risk_assessment_id, row_number() over (order by watercraft_journey_id asc) from watercraft_journey where journey_type = 2) as dwj_3 ON wra.watercraft_risk_assessment_id = dwj_3.watercraft_risk_assessment_id and dwj_3.row_number = 3

LEFT JOIN observer_workflow ow ON ow.observer_workflow_id = wra.observer_workflow_id
LEFT JOIN application_user au ON au.user_id = ow.created_by_user_id
LEFT JOIN high_risk_assessment hra ON hra.high_risk_assessment_id = wra.high_risk_assessment_id
ORDER BY ow.start_time,
         au.preferred_username,
         wra. "timestamp" DESC 
         
--OFFSET 10000 
-- add the prev1, prev2 prev3 dest1 dest2 dest3 water bodies 
-- export to comma delimited csv 
--might need to figure out a way to show the right time zone 

