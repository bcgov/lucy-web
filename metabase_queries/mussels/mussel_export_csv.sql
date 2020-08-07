SELECT wra.watercraft_risk_assessment_id,
       au.email,
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

  (SELECT water_body_id
   FROM watercraft_journey wj
   WHERE wj.watercraft_risk_assessment_id = wra.watercraft_risk_assessment_id
     AND wj.journey_type = 1
   ORDER BY watercraft_risk_assessment_id DESC
   LIMIT 1) AS previous_journey_water_body_id_1,

  (SELECT water_body_id
   FROM watercraft_journey wj
   WHERE wj.watercraft_risk_assessment_id = wra.watercraft_risk_assessment_id
     AND wj.journey_type = 1
   ORDER BY watercraft_risk_assessment_id DESC
   LIMIT 1
   OFFSET 1) AS previous_journey_water_body_id_2,

  (SELECT water_body_id
   FROM watercraft_journey wj
   WHERE wj.watercraft_risk_assessment_id = wra.watercraft_risk_assessment_id
     AND wj.journey_type = 1
   ORDER BY watercraft_risk_assessment_id DESC
   LIMIT 1
   OFFSET 2) AS previous_journey_water_body_id_3,
 wra.previous_dry_storage_ind,
 wra.unknown_previous_water_body_ind,
 wra.commercial_manufacturer_as_previous_water_body_ind ,

  (SELECT water_body_id
   FROM watercraft_journey wj
   WHERE wj.watercraft_risk_assessment_id = wra.watercraft_risk_assessment_id
     AND wj.journey_type = 2
   ORDER BY watercraft_risk_assessment_id DESC
   LIMIT 1) AS destination_journey_water_body_id_1,

  (SELECT water_body_id
   FROM watercraft_journey wj
   WHERE wj.watercraft_risk_assessment_id = wra.watercraft_risk_assessment_id
     AND wj.journey_type = 2
   ORDER BY watercraft_risk_assessment_id DESC
   LIMIT 1
   OFFSET 1) AS destination_journey_water_body_id_2,

  (SELECT water_body_id
   FROM watercraft_journey wj
   WHERE wj.watercraft_risk_assessment_id = wra.watercraft_risk_assessment_id
     AND wj.journey_type = 2
   ORDER BY watercraft_risk_assessment_id DESC
   LIMIT 1
   OFFSET 2) AS destination_journey_water_body_id_3,  wra.destination_dry_storage_ind,

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
LEFT JOIN observer_workflow ow ON ow.observer_workflow_id = wra.observer_workflow_id
LEFT JOIN application_user au ON au.user_id = ow.created_by_user_id
LEFT JOIN high_risk_assessment hra ON hra.high_risk_assessment_id = wra.high_risk_assessment_id
ORDER BY ow.start_time,
         au.preferred_username,
         wra.watercraft_risk_assessment_id,
         wra. "timestamp" DESC
