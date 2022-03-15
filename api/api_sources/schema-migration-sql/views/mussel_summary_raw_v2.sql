create view mussel_summary_raw_v2 AS
 SELECT mussel_summary_raw.watercraft_risk_assessment_id,
    mussel_summary_raw.email,
    mussel_summary_raw.station,
    mussel_summary_raw.start_time,
    mussel_summary_raw.end_time,
    mussel_summary_raw.k9_on_shift_ind,
    mussel_summary_raw.motorized_blow_bys_counter,
    mussel_summary_raw.non_motorized_blow_bys_counter,
    mussel_summary_raw.boats_inspected_ind,
    mussel_summary_raw.shift_start_comment,
    mussel_summary_raw.shift_end_comment,
    mussel_summary_raw.raw_timestamp,
    mussel_summary_raw.passport_holder_ind,
    mussel_summary_raw.passport_number,
    mussel_summary_raw.launched_outside_bc_ind,
    mussel_summary_raw.decontamination_performed_ind,
    mussel_summary_raw.decontamination_reference,
    mussel_summary_raw.province_code,
    mussel_summary_raw.country_code,
    mussel_summary_raw.non_motorized_counter,
    mussel_summary_raw.simple_counter,
    mussel_summary_raw.complex_counter,
    mussel_summary_raw.very_complex_count,
    mussel_summary_raw.number_of_people_in_party,
    mussel_summary_raw.commercially_hauled_ind,
    mussel_summary_raw.previous_ais_knowledge_ind,
    mussel_summary_raw.previous_ais_knowledge_source_code_id,
    mussel_summary_raw.previous_inspection_ind,
    mussel_summary_raw.previous_inspection_source_code_id,
    mussel_summary_raw.previous_inspection_days_count,
    mussel_summary_raw.previous_journey_water_body_id_1,
    mussel_summary_raw.previous_journey_water_body_id_2,
    mussel_summary_raw.previous_journey_water_body_id_3,
    mussel_summary_raw.previous_dry_storage_ind,
    mussel_summary_raw.unknown_previous_water_body_ind,
    mussel_summary_raw.commercial_manufacturer_as_previous_water_body_ind,
    mussel_summary_raw.destination_journey_water_body_id_1,
    mussel_summary_raw.destination_journey_water_body_id_2,
    mussel_summary_raw.destination_journey_water_body_id_3,
    mussel_summary_raw.destination_dry_storage_ind,
    mussel_summary_raw.k9_inspection_ind,
    mussel_summary_raw.unknown_destination_water_body_ind,
    mussel_summary_raw.commercial_manufacturer_as_destination_water_body_ind,
    mussel_summary_raw.marine_species_found_ind,
    mussel_summary_raw.aquatic_plants_found_ind,
    mussel_summary_raw.marine_mussel_found_ind,
    mussel_summary_raw.adult_dreissenidae_found_ind,
    mussel_summary_raw.high_risk_area_ind,
    mussel_summary_raw.high_risk_ais_ind,
    mussel_summary_raw.high_risk_assessment_id,
    mussel_summary_raw.watercraft_registration,
    mussel_summary_raw.clean_drain_dry_after_inspection_ind,
    mussel_summary_raw.standing_water_present_ind,
    mussel_summary_raw.standing_water_location_code_id,
    mussel_summary_raw.adult_dreissenidae_mussel_found_ind,
    mussel_summary_raw.adult_mussels_location_code_id,
    mussel_summary_raw.quarantine_period_issued_ind,
    mussel_summary_raw.seal_issued_ind,
    mussel_summary_raw.seal_number,
    mussel_summary_raw.other_inspection_findings,
    mussel_summary_raw.general_comments,
    mussel_summary_raw.general_comment,
    mussel_summary_raw.created_at,
    mussel_summary_raw.updated_at,
    mussel_summary_raw.updated_by_user_id,
    mussel_summary_raw.created_by_user_id
   FROM mussel_summary_raw
  WHERE (mussel_summary_raw.watercraft_risk_assessment_id <> ALL (ARRAY[31247, 31164, 31245, 31244, 31161, 31242, 31159, 30119, 28535, 28286, 28533, 28284, 28531, 28282, 28281, 28280, 28279, 28278, 28277, 28276, 28523, 28522, 28273, 28272, 28271, 28270, 28269, 28516, 28267, 28514, 28265, 28264, 28511, 28262, 28261, 28260, 28259, 28258, 28505, 30084, 30598, 30082, 30081, 30080, 30079, 30078, 30077, 30076, 30075, 30589, 30073, 30072, 30071, 30070, 26453, 26505, 26504, 26503, 26449, 26448, 26500, 26499, 26445, 26497, 26443, 26442, 26441, 26492, 26491, 26493, 24531, 24530, 24524, 24523, 24522, 23900, 23903, 23898, 23901, 23473, 23178, 23471, 23176, 23175, 23468, 23173, 23172, 23465, 23464, 23169, 23168, 23461, 23460, 23459, 23164, 23457, 23162, 23161, 23160, 23453, 23452, 23157, 23156, 23155, 23154, 23153, 23446, 23151, 23150, 22859, 22903, 22857, 22901, 22855, 22899, 22853, 22897, 22851, 22895, 22849, 22848, 22847, 22891, 22845, 22889, 22843, 22887, 22841, 22840, 22884, 22883, 22837, 22836, 22880, 22879, 22878, 22832, 22876, 22830, 22874, 22828, 22872, 22871, 22870, 22824, 22868, 22822, 22866, 22820, 22864, 22818, 22817, 22816, 22860, 20913, 20914, 20959, 20958, 20957, 20956, 20908, 20907, 20906, 20905, 20904, 20903, 20902, 20901, 20900, 20899, 20898, 20897, 20896, 20895, 20894, 20893, 20892, 20891, 20890, 20936, 20888, 20887, 20886, 20885, 20884, 18778, 18779, 18780, 18418, 17220, 17219, 17218, 17217, 17216, 17215, 17214, 17213, 17212, 17211, 17210, 17209, 17208, 17207, 17206, 17205, 17204, 16018, 16017, 16002, 16015, 16014, 16013, 16012, 16011, 16010, 16009, 16008, 15993, 15992, 16005, 18430, 28289, 20238, 18426, 18424, 18420, 18422, 18428, 15560, 15558, 15556, 28288, 18429, 18425, 18423, 18419, 18421, 18427, 15559, 15557, 15555, 15553, 14701, 14735, 14734, 14733, 14732, 14731, 14730, 14729, 14728, 14727, 14726, 14725, 14724, 14723, 14722, 14721, 14720, 14719, 14718, 14717, 14716, 14715, 14679, 14678, 14677, 14676, 14675, 14674, 14673, 14672, 14671, 14705, 14704, 14703, 14702, 27503, 27502, 27501, 27500, 27531, 27530, 27529, 27496, 27495, 27494, 27525, 27524, 27523, 27490, 27521, 27520, 27487, 27486, 27485, 27484, 27515, 27482, 27513, 27512, 27511, 27510, 27477, 27476, 27475, 27474, 27473, 27472, 14020, 14019, 14018, 14017, 14016, 14015, 14014, 14013, 14012, 14011, 14378, 14009, 14008, 14007, 14006, 14005, 14004, 14003, 14002, 14001, 14000, 13999, 13998, 13997, 13996, 13960, 14363, 13959, 14362, 13958, 14361, 13957, 14360, 13956, 14359, 13955, 13990, 13954, 14357, 13953, 13988, 13952, 13987, 13951, 13986, 13950, 13985, 13949, 13984, 13948, 13983, 13947, 13982, 14349, 13946, 13945, 13980, 13944, 13979, 13943, 13978, 14345, 13942, 13976, 13941, 13975, 13940, 13974, 13939, 13938, 14341, 13937, 13972, 14339, 13936, 13935, 13970, 14337, 13934, 13933, 13968, 13932, 13967, 13931, 13966, 14333, 13930, 13964, 13929, 13928, 13963, 13962, 13927, 14329, 13961, 13025, 13024, 12968, 12967, 13021, 12965, 12964, 12963, 13017, 13016, 12960, 12959, 13013, 13012, 12956, 13010, 12954, 13008, 13007, 13006, 13005, 13004, 13003, 12947, 12946, 12945, 12944, 12943, 12997, 12996, 12940, 12939, 12993, 12992, 12991, 12990, 12989, 12988, 12987, 12986, 12985, 12984, 12928, 12982, 12981, 12980, 12979, 12978, 12977, 12976, 12975, 12919, 12918, 12917, 12916, 12358, 30325, 12362, 12361, 12461, 12360, 13243, 12359, 12464, 12914, 12915, 12913, 12912, 12910, 12911, 12463, 13246, 13245, 13244, 12462, 12460, 11531, 11530, 11529, 11528, 11527, 11526, 11525, 11524, 11523, 11522, 11521, 11520, 11519, 11479, 11478, 11516, 11515, 11514, 11474, 11473, 11472, 11471, 11509, 11508, 11468, 11506, 11505, 11504, 11503, 11502, 11501, 11461, 11460, 11459, 11458, 11457, 11456, 11455, 11454, 12705, 9598, 12642, 9893, 18232, 18360, 18295, 18666, 12704, 9597, 12641, 9892, 18359, 18231, 18665, 18728, 12703, 9596, 12640, 9891, 18230, 18664, 18727, 18358, 12702, 9595, 12639, 9890, 18357, 18229, 18663, 18726, 12638, 12701, 9594, 9889, 18662, 18725, 18356, 18228, 12700, 9593, 12637, 9888, 18355, 18227, 18724, 18290, 12699, 9592, 12636, 9887, 18354, 18289, 18226, 18660, 12635, 12698, 9591, 9886, 18353, 18722, 18225, 18288, 18721, 12697, 9590, 12634, 9885, 18658, 18287, 18352, 12696, 9589, 12633, 9884, 18351, 18223, 18720, 18657, 18719, 12695, 9588, 12632, 9883, 18350, 18222, 18656, 18655, 12694, 9587, 12631, 9882, 18349, 18221, 18718, 12693, 9586, 9881, 12630, 18654, 18348, 18220, 18717, 12692, 9585, 12629, 9880, 18716, 18347, 18219, 18653, 18715, 12691, 9584, 12628, 9879, 18346, 18281, 18652, 12690, 9583, 12627, 9878, 18345, 18217, 18651, 18714, 18713, 12689, 9582, 12626, 9877, 18344, 18279, 18216, 12688, 9581, 12625, 9876, 18712, 18649, 18343, 18215, 18711, 12687, 9580, 9875, 12624, 18648, 18342, 18214, 18710, 12686, 9579, 12623, 9874, 18647, 18341, 18213, 12685, 9578, 12622, 9873, 18340, 18275, 18212, 18646, 18708, 12621, 12684, 9577, 9872, 18645, 18339, 18274, 12683, 9576, 12620, 9871, 18644, 18338, 18273, 18210, 18706, 12682, 9575, 12619, 9870, 18643, 18209, 18337, 12681, 9574, 12618, 9869, 18336, 18208, 18271, 18642, 12680, 18704, 9573, 12617, 9868, 18335, 18270, 18207, 12679, 9572, 12616, 9867, 18334, 18269, 18206, 18703, 12678, 9571, 12615, 9866, 18639, 18205, 18268, 18333, 18701, 12677, 9570, 12614, 9865, 18332, 18267, 18204, 12613, 12676, 18700, 9569, 9864, 18331, 18266, 18203, 12612, 12675, 18636, 9568, 9863, 18265, 18202, 18330, 12611, 12674, 9567, 9862, 18329, 18264, 18201, 18635, 12610, 12673, 9566, 9861, 18328, 18263, 18200, 18697, 12609, 12672, 18696, 9565, 9860, 18262, 18327, 18633, 12608, 12671, 18695, 9564, 9859, 18198, 18261, 18326, 12607, 12670, 9563, 9858, 18325, 18260, 18197, 18631, 12606, 12669, 9562, 9857, 18324, 18259, 18196, 18630, 12605, 12668, 9561, 9856, 18692, 18258, 18323, 18629, 12604, 12667, 9560, 9855, 18322, 18257, 18194, 18691, 12603, 12666, 18690, 9559, 9854, 18256, 18321, 18193, 12602, 12665, 9558, 9853, 18320, 18255, 18192, 18689, 12601, 12664, 9557, 9852, 18319, 18688, 18254, 18625, 12600, 12663, 9556, 9851, 18624, 18318, 18190, 18253, 12662, 9555, 9850, 18623, 18317, 18686, 18189, 18252, 12661, 9554, 9849, 18316, 18251, 18188, 18622, 18685, 12660, 9553, 9848, 18315, 18250, 18187, 18684, 12597, 12659, 9552, 9847, 18683, 18314, 18186, 18249, 18620, 12658, 9551, 9846, 18313, 18185, 18248, 18619, 18682, 12657, 9550, 9845, 18312, 18618, 18247, 18184, 18681, 12656, 9549, 9844, 18311, 18183, 18617, 18246, 18680, 9548, 12655, 9843, 18310, 18182, 18245, 18679, 18616, 9547, 12654, 9842, 18309, 18615, 18244, 18181, 18678, 9546, 12653, 9841, 18677, 18308, 18180, 18243, 18614, 9545, 12652, 9840, 18307, 18179, 18242, 18676, 18613, 18675, 9544, 12651, 9839, 18306, 18241, 18178, 18612, 9543, 12650, 9838, 18177, 18611, 18240, 18674, 18305, 18673, 9542, 12649, 9837, 18304, 18176, 18239, 18610, 18672, 9541, 12648, 9836, 18175, 18303, 18238, 18609, 18671, 9540, 12647, 9835, 18174, 18608, 18237, 18302, 9539, 12646, 9834, 18173, 18236, 18670, 18607, 18301, 9538, 12645, 9833, 18172, 18235, 18669, 18300, 18606, 9537, 12644, 18171, 9832, 18668, 18234, 18299, 18297, 18605, 9536, 12643, 9831, 18667, 18170, 18604, 18233, 18296, 18298, 7985, 7984, 7983, 7982, 7981, 7980, 7979, 7978, 7977, 7976, 7975, 7974, 7973, 7972, 7971, 7970, 7969, 7968, 7967, 7966, 7965, 7964, 7963, 7962, 7961, 7960, 7959, 7958, 7957, 7956, 7955, 7954, 7953, 7952, 7951, 7950, 7949, 7948, 8031, 7947, 8030, 7946, 8029, 7945, 8028, 7944, 8027, 7943, 8026, 7942, 8025, 7941, 8024, 7940, 8023, 7939, 8022, 7938, 8021, 7937, 8020, 7936, 8019, 7935, 8018, 7934, 8017, 7933, 8016, 7932, 8015, 7931, 8014, 7930, 8013, 7929, 8012, 7928, 8011, 7927, 8010, 7926, 8009, 7925, 8008, 7924, 8007, 7923, 8006, 7922, 8005, 7921, 8004, 7920, 8003, 7919, 8002, 7918, 8001, 7917, 8000, 7916, 7999, 7915, 7998, 7914, 7997, 7913, 7996, 7912, 7995, 7911, 7994, 7910, 7993, 7909, 7992, 7908, 7991, 7907, 7990, 7906, 7989, 7905, 7988, 7904, 7987, 7903, 7986, 8289, 9142, 9189, 9313, 9360, 12210, 12257, 12163, 12458, 7788, 8288, 9188, 9141, 9312, 9359, 12209, 12256, 12457, 12162, 7787, 8287, 9140, 9187, 9358, 9311, 12208, 12255, 12456, 12161, 7786, 8286, 12207, 9139, 9186, 9357, 9310, 12254, 12455, 12160, 7785, 8285, 9138, 9185, 9356, 9309, 12253, 12454, 12159, 12206, 7784, 8284, 12205, 9137, 9184, 9355, 9308, 12252, 12453, 12158, 7783, 8283, 9183, 9136, 9307, 9354, 12251, 12157, 12204, 12452, 7782, 8282, 9182, 9135, 9353, 9306, 12250, 12451, 12203, 12156, 7781, 8281, 12202, 9181, 9134, 9352, 9305, 12155, 12249, 12450, 7780, 8280, 9180, 9133, 9304, 9351, 12248, 12201, 12449, 12154, 7779, 8279, 12448, 9179, 9132, 9303, 9350, 12153, 12200, 12247, 7778, 8278, 9131, 9178, 9349, 9302, 12246, 12199, 12152, 12447, 7777, 8277, 9177, 9130, 9301, 9348, 12198, 12151, 12245, 12446, 7776, 8276, 9176, 9129, 9347, 9300, 12244, 12197, 12445, 12150, 7775, 8275, 12196, 9175, 9128, 9346, 9299, 12149, 12243, 12444, 7774, 8274, 9174, 9127, 9345, 9298, 12242, 12195, 12443, 12148, 7773, 8273, 9173, 9126, 9297, 9344, 12147, 12194, 12241, 12442, 7772, 8272, 12193, 9172, 9125, 9343, 9296, 12240, 12441, 12146, 7771, 8271, 12440, 9124, 9171, 9295, 9342, 12192, 12145, 12239, 7770, 8270, 9123, 9170, 9341, 9294, 12238, 12191, 12439, 12144, 7769, 8269, 9122, 9169, 9293, 9340, 12190, 12143, 12237, 12438, 7768, 12189, 8268, 9121, 9168, 9339, 9292, 12236, 12142, 12437, 7767, 8267, 12436, 9120, 9167, 9291, 9338, 12141, 12188, 12235, 7766, 8266, 9119, 9166, 12234, 9290, 9337, 12187, 12435, 12140, 7765, 8265, 12434, 9118, 9165, 9289, 9336, 12186, 12139, 12233, 7764, 8264, 9117, 9164, 12232, 9288, 9335, 12185, 12433, 12138, 7763, 8263, 12184, 9116, 9163, 9287, 9334, 12137, 12231, 12432, 7762, 8262, 12183, 9115, 9162, 12230, 9286, 9333, 12431, 12136, 7761, 8261, 9114, 9161, 9285, 9332, 12135, 12182, 12229, 12430, 7760, 8260, 9113, 12228, 9160, 9284, 9331, 12181, 12429, 12134, 7759, 8259, 9112, 9159, 9283, 9330, 12180, 12133, 12227, 12428, 7758, 8258, 12179, 12226, 9111, 9158, 9282, 9329, 12427, 12132, 7757, 8257, 9110, 9157, 9281, 9328, 12131, 12178, 12225, 12426, 7756, 8256, 12224, 9109, 9156, 9280, 9327, 12177, 12425, 12130, 7755, 8255, 9108, 9155, 9279, 9326, 12129, 12176, 12223, 12424, 7754, 8254, 12128, 9107, 9154, 9278, 9325, 12175, 12222, 12423, 7753, 8253, 12422, 12174, 9106, 9153, 9277, 9324, 12127, 12221, 7752, 8252, 9105, 9152, 9276, 9323, 12220, 12126, 12173, 12421, 7751, 8251, 12172, 9104, 9151, 9275, 9322, 12125, 12219, 12420, 7750, 8250, 12218, 12124, 9103, 9150, 9274, 9321, 12171, 12419, 7749, 8249, 9102, 9149, 9273, 9320, 12170, 12123, 12217, 12418, 7748, 8248, 12122, 12169, 9101, 9148, 12216, 9272, 9319, 12417, 7747, 8247, 12416, 9100, 9147, 9271, 9318, 12168, 12121, 12215, 7746, 8246, 12214, 12120, 9099, 9146, 9270, 9317, 12167, 12415, 7745, 8245, 12166, 9098, 9145, 9269, 9316, 12119, 12213, 12414, 7744, 8244, 12118, 12212, 12413, 9097, 9144, 9268, 9315, 12165, 7743, 8243, 12211, 9096, 9143, 9267, 9314, 12117, 12164, 12412, 7742, 5195, 5194, 5193, 5200, 5199, 5198, 5197, 4157, 4156, 4155, 4154, 4153, 4152, 4151, 4150, 4149, 4148, 4147, 4146, 4145, 4144, 4143, 4142, 4141, 4140, 4139, 4138, 4137, 4136, 4135, 4134, 4133, 4132, 4131, 4130, 4129, 4128, 5423, 5422, 5421, 5420, 5419, 5418, 5417, 5416, 5407, 5415, 5406, 5414, 5405, 5413, 5404, 5412, 5403, 5411, 5402, 5410, 5401, 5409, 5400, 5408, 5211, 5210, 5209, 5208, 5207, 5206, 5205, 5204, 5203, 5202, 5201, 10596, 20920, 10603, 10610, 2708, 2719, 2726, 2733, 2740, 2747, 6085, 6282, 6289, 6299, 6626, 3321, 3328, 3451, 3458, 3465, 3472, 3479, 6972, 6965, 3486, 6979, 7263, 7270, 20919, 10595, 10602, 10609, 2707, 2718, 2725, 2732, 2739, 2746, 6084, 6281, 6288, 6298, 6625, 3320, 3327, 3450, 3457, 3464, 3471, 3478, 6971, 6964, 3485, 6978, 7262, 7269, 20918, 10594, 10601, 10608, 2706, 2717, 2724, 2731, 2738, 2745, 6083, 6280, 6287, 6297, 6624, 3319, 3326, 3449, 3456, 3463, 3470, 3477, 6970, 6963, 3484, 6977, 7261, 7268, 20917, 10593, 10600, 10607, 2705, 2712, 2716, 2723, 2730, 2737, 2744, 6082, 6279, 6286, 6296, 6623, 3318, 3325, 3448, 3455, 3462, 3469, 3476, 6969, 6962, 3483, 6976, 7260, 7267, 20916, 10592, 10599, 10606, 2704, 2711, 2715, 2722, 2729, 2736, 2743, 6081, 6278, 6285, 6292, 6295, 6622, 3317, 3324, 3447, 3454, 3461, 3468, 3475, 6961, 3482, 6968, 6975, 7259, 7266, 10591, 10598, 10605, 2703, 2710, 2714, 2721, 2728, 2735, 2742, 6080, 6277, 6284, 6291, 6294, 6621, 3316, 3323, 3446, 3453, 3460, 3467, 3474, 6960, 3481, 6967, 6974, 7258, 7265, 20915, 10590, 10597, 10604, 2702, 2709, 2713, 2720, 2727, 2734, 2741, 6079, 6276, 6283, 6290, 6293, 6620, 3315, 3322, 3445, 3452, 3459, 3466, 3473, 6959, 3480, 6966, 6973, 7257, 7264, 2596, 9364, 4691, 4697, 4701, 4705, 4709, 9523, 9527, 9531, 9535, 4840, 4844, 4851, 4855, 4859, 4982, 5710, 5714, 5718, 5722, 7736, 7741, 7841, 7845, 7849, 7853, 9363, 4690, 4696, 4700, 4704, 4708, 9522, 9526, 9530, 9534, 4839, 4843, 4847, 4850, 4854, 4858, 4981, 5709, 5713, 5717, 5721, 7735, 7740, 7840, 7844, 7848, 7852, 9362, 4689, 4693, 4695, 4699, 4703, 4707, 9521, 9525, 9529, 9533, 4838, 4842, 4846, 4849, 4853, 4857, 4980, 5708, 5712, 5716, 5720, 7734, 7739, 7839, 7843, 7847, 7851, 9361, 4688, 4692, 4694, 4698, 4702, 4706, 9520, 9524, 9528, 9532, 4837, 4841, 4845, 4848, 4852, 4856, 4979, 5707, 5711, 5715, 5719, 7733, 7738, 7838, 7842, 7846, 7850, 2262, 2261, 2260, 2259, 2258, 2257, 2256, 2255, 2254, 2253, 2252, 2251, 2250, 2249, 2248, 2247, 2246, 2245, 14665, 2122, 16540, 2130, 14403, 2138, 17044, 2146, 15398, 9736, 20117, 9744, 19789, 9753, 14411, 16548, 17052, 15170, 15390, 14657, 14419, 2121, 14664, 2129, 14418, 2137, 19788, 2145, 16539, 9735, 15169, 9743, 17051, 9752, 20035, 17043, 16547, 15397, 20116, 14402, 15389, 14656, 2120, 20115, 2128, 14663, 2136, 14417, 2144, 15168, 9734, 14401, 9742, 15396, 9751, 14655, 20034, 17050, 16546, 14409, 15388, 19787, 17042, 2119, 20033, 2127, 16537, 2135, 16545, 2143, 15387, 9733, 14662, 9741, 14416, 9750, 17049, 14400, 14408, 17041, 15167, 19786, 20114, 14654, 2118, 17048, 2126, 14407, 2134, 14399, 2142, 16536, 9732, 15166, 9740, 19785, 9749, 15386, 17040, 20113, 14653, 16544, 15394, 14415, 14661, 2117, 19784, 2125, 16535, 2133, 15165, 2141, 20031, 9731, 14398, 9739, 17047, 9748, 17039, 14652, 15393, 16543, 14406, 20112, 15385, 14660, 2116, 14397, 2124, 16542, 2132, 14405, 2140, 14659, 9730, 14651, 9738, 14413, 9747, 17038, 19783, 15384, 20111, 17046, 20030, 15392, 16534, 2115, 17045, 2123, 19782, 2131, 17037, 2139, 15391, 9729, 15163, 9737, 14650, 9746, 14658, 14404, 20029, 16541, 16533, 14396, 20110, 15383, 5995, 5994, 5993, 5992, 5991, 5990, 5989, 5988, 5987, 5196, 453, 228, 10, 1326, 1325, 1324, 9, 8, 7, 6, 5, 4, 1, 3, 2]));