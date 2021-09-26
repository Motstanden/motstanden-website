-- ::::::::::::::::::::::::::::::::::::::::::::::::
--      Insert current version into DB.
-- ::::::::::::::::::::::::::::::::::::::::::::::::

INSERT INTO version(migration) VALUES 
('03_insert_sheet_archive_data.sql');



-- ::::::::::::::::::::::::::::::::::::::::::::::::
--              Five part system
-- ::::::::::::::::::::::::::::::::::::::::::::::::

-- Pikkolofløyte: Part 1-3
INSERT INTO five_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Pikkolofløyte';
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Pikkolofløyte';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Pikkolofløyte';

-- Tverrfløyte: Part 2-4
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Tverrfløyte';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Tverrfløyte';
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Tverrfløyte';

-- Obo: Part 4-5
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Obo';
INSERT INTO five_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Obo';



-- ::::::::::::::::::::::::::::::::::::::::::::::::
--              Seven part system
-- ::::::::::::::::::::::::::::::::::::::::::::::::

-- Pikkolofløyte: Part 1-3
INSERT INTO seven_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Pikkolofløyte';
INSERT INTO seven_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Pikkolofløyte';
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Pikkolofløyte';

-- Tverrfløyte: Part 3-5
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Tverrfløyte';
INSERT INTO seven_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Tverrfløyte';
INSERT INTO seven_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Tverrfløyte';

-- Obo: Part 6-7
INSERT INTO seven_part_system SELECT instrument_id, 6 FROM instrument WHERE instrument = 'Obo';
INSERT INTO seven_part_system SELECT instrument_id, 7 FROM instrument WHERE instrument = 'Obo';