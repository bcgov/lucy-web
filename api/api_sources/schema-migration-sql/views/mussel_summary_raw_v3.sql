create view mussel_summary_raw_v3 AS
 SELECT mussel_summary_raw_v2.watercraft_risk_assessment_id,
    mussel_summary_raw_v2.email,
    mussel_summary_raw_v2.station,
    mussel_summary_raw_v2.start_time,
    mussel_summary_raw_v2.end_time,
    mussel_summary_raw_v2.k9_on_shift_ind,
    mussel_summary_raw_v2.motorized_blow_bys_counter,
    mussel_summary_raw_v2.non_motorized_blow_bys_counter,
    mussel_summary_raw_v2.boats_inspected_ind,
    mussel_summary_raw_v2.shift_start_comment,
    mussel_summary_raw_v2.shift_end_comment,
    mussel_summary_raw_v2.raw_timestamp,
    mussel_summary_raw_v2.passport_holder_ind,
    mussel_summary_raw_v2.passport_number,
    mussel_summary_raw_v2.launched_outside_bc_ind,
    mussel_summary_raw_v2.decontamination_performed_ind,
    mussel_summary_raw_v2.decontamination_reference,
    mussel_summary_raw_v2.province_code,
    mussel_summary_raw_v2.country_code,
    mussel_summary_raw_v2.non_motorized_counter,
    mussel_summary_raw_v2.simple_counter,
    mussel_summary_raw_v2.complex_counter,
    mussel_summary_raw_v2.very_complex_count,
    mussel_summary_raw_v2.number_of_people_in_party,
    mussel_summary_raw_v2.commercially_hauled_ind,
    mussel_summary_raw_v2.previous_ais_knowledge_ind,
    mussel_summary_raw_v2.previous_ais_knowledge_source_code_id,
    mussel_summary_raw_v2.previous_inspection_ind,
    mussel_summary_raw_v2.previous_inspection_source_code_id,
    mussel_summary_raw_v2.previous_inspection_days_count,
    mussel_summary_raw_v2.previous_journey_water_body_id_1,
    mussel_summary_raw_v2.previous_journey_water_body_id_2,
    mussel_summary_raw_v2.previous_journey_water_body_id_3,
    mussel_summary_raw_v2.previous_dry_storage_ind,
    mussel_summary_raw_v2.unknown_previous_water_body_ind,
    mussel_summary_raw_v2.commercial_manufacturer_as_previous_water_body_ind,
    mussel_summary_raw_v2.destination_journey_water_body_id_1,
    mussel_summary_raw_v2.destination_journey_water_body_id_2,
    mussel_summary_raw_v2.destination_journey_water_body_id_3,
    mussel_summary_raw_v2.destination_dry_storage_ind,
    mussel_summary_raw_v2.k9_inspection_ind,
    mussel_summary_raw_v2.unknown_destination_water_body_ind,
    mussel_summary_raw_v2.commercial_manufacturer_as_destination_water_body_ind,
    mussel_summary_raw_v2.marine_species_found_ind,
    mussel_summary_raw_v2.aquatic_plants_found_ind,
    mussel_summary_raw_v2.marine_mussel_found_ind,
    mussel_summary_raw_v2.adult_dreissenidae_found_ind,
    mussel_summary_raw_v2.high_risk_area_ind,
    mussel_summary_raw_v2.high_risk_ais_ind,
    mussel_summary_raw_v2.high_risk_assessment_id,
    mussel_summary_raw_v2.watercraft_registration,
    mussel_summary_raw_v2.clean_drain_dry_after_inspection_ind,
    mussel_summary_raw_v2.standing_water_present_ind,
    mussel_summary_raw_v2.standing_water_location_code_id,
    mussel_summary_raw_v2.adult_dreissenidae_mussel_found_ind,
    mussel_summary_raw_v2.adult_mussels_location_code_id,
    mussel_summary_raw_v2.quarantine_period_issued_ind,
    mussel_summary_raw_v2.seal_issued_ind,
    mussel_summary_raw_v2.seal_number,
    mussel_summary_raw_v2.other_inspection_findings,
    mussel_summary_raw_v2.general_comments,
    mussel_summary_raw_v2.general_comment,
    mussel_summary_raw_v2.created_at,
    mussel_summary_raw_v2.updated_at,
    mussel_summary_raw_v2.updated_by_user_id,
    mussel_summary_raw_v2.created_by_user_id
   FROM mussel_summary_raw_v2
  WHERE (mussel_summary_raw_v2.watercraft_risk_assessment_id <> 1488);