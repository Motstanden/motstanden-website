-- ::::::::::::::::::::::::::::::::::::::::::::::::
--      Insert current version into DB.
-- ::::::::::::::::::::::::::::::::::::::::::::::::

INSERT INTO version(migration) VALUES 
('04_insert_sheet_archive_data.sql');



-- ::::::::::::::::::::::::::::::::::::::::::::::::
--              Five part system
-- ::::::::::::::::::::::::::::::::::::::::::::::::

-- Pikkolofløyte: Part 1
INSERT INTO five_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Pikkolofløyte';

-- Tverrfløyte: Part 1
INSERT INTO five_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Tverrfløyte';

-- Obo: Part 1
INSERT INTO five_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Obo';

-- Fagott: Part 4-5
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Fagott';
INSERT INTO five_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Fagott';

-- Altklarinett: Part 1-3
INSERT INTO five_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Altklarinett';
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Altklarinett';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Altklarinett';

-- Klarinett: Part 1-3
INSERT INTO five_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Klarinett';
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Klarinett';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Klarinett';

-- Bassklarinett: Part 4-5
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Bassklarinett';
INSERT INTO five_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Bassklarinett';

-- Trompet: Part 1-3
INSERT INTO five_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Trompet';
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Trompet';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Trompet';

-- Kornett: Part 1-3
INSERT INTO five_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Kornett';
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Kornett';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Kornett';

-- Flygelhorn: Part 1-3
INSERT INTO five_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Flygelhorn';
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Flygelhorn';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Flygelhorn';

-- Sopransaksofon: Part 1-3
INSERT INTO five_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Sopransaksofon';
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Sopransaksofon';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Sopransaksofon';

-- Altsaksofon: Part 2-3
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Altsaksofon';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Altsaksofon';
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Altsaksofon';

-- Tenorsaksofon: Part 4
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Tenorsaksofon';

-- Barytonsaksofon: Part 5
INSERT INTO five_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Barytonsaksofon';

-- Horn: Part 2-4
INSERT INTO five_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Horn';
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Horn';
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Horn';

-- Baryton: Part 3-4
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Baryton';
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Baryton';

-- Eufonium: Part 3-4
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Eufonium';
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Eufonium';

-- Alttrombone: Part 3-4
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Alttrombone';
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Alttrombone';

-- Trombone: Part 3-4
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Trombone';
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Trombone';

-- Basstrombone: Part 3-5
INSERT INTO five_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Basstrombone';
INSERT INTO five_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Basstrombone';
INSERT INTO five_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Basstrombone';

-- Tuba: Part 5
INSERT INTO five_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Tuba';

-- Bassgitar: Part 5
INSERT INTO five_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Bassgitar';



-- ::::::::::::::::::::::::::::::::::::::::::::::::
--              Seven part system
-- ::::::::::::::::::::::::::::::::::::::::::::::::

-- Pikkolofløyte: Part 1, 3
INSERT INTO seven_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Pikkolofløyte';
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Pikkolofløyte';

-- Tverrfløyte: Part 1, 3
INSERT INTO seven_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Tverrfløyte';
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Tverrfløyte';

-- Obo: Part 1, 3
INSERT INTO seven_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Obo';
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Obo';

-- Fagott: Part 6-7
INSERT INTO seven_part_system SELECT instrument_id, 6 FROM instrument WHERE instrument = 'Fagott';
INSERT INTO seven_part_system SELECT instrument_id, 7 FROM instrument WHERE instrument = 'Fagott';

-- Altklarinett: Part 1-3
INSERT INTO seven_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Altklarinett';
INSERT INTO seven_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Altklarinett';
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Altklarinett';

-- Klarinett: Part 1-3
INSERT INTO seven_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Klarinett';
INSERT INTO seven_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Klarinett';
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Klarinett';

-- Bassklarinett: Part 6-7
INSERT INTO seven_part_system SELECT instrument_id, 6 FROM instrument WHERE instrument = 'Bassklarinett';
INSERT INTO seven_part_system SELECT instrument_id, 7 FROM instrument WHERE instrument = 'Bassklarinett';

-- Trompet: Part 1-4
INSERT INTO seven_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Trompet';
INSERT INTO seven_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Trompet';
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Trompet';
INSERT INTO seven_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Trompet';

-- Kornett: Part 1-4
INSERT INTO seven_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Kornett';
INSERT INTO seven_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Kornett';
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Kornett';
INSERT INTO seven_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Kornett';

-- Flygelhorn: Part 1-4
INSERT INTO seven_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Flygelhorn';
INSERT INTO seven_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Flygelhorn';
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Flygelhorn';
INSERT INTO seven_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Flygelhorn';

-- Sopransaksofon: Part 1-3
INSERT INTO seven_part_system SELECT instrument_id, 1 FROM instrument WHERE instrument = 'Sopransaksofon';
INSERT INTO seven_part_system SELECT instrument_id, 2 FROM instrument WHERE instrument = 'Sopransaksofon';
INSERT INTO seven_part_system SELECT instrument_id, 3 FROM instrument WHERE instrument = 'Sopransaksofon';

-- Altsaksofon: Part 4-5
INSERT INTO seven_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Altsaksofon';
INSERT INTO seven_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Altsaksofon';

-- Tenorsaksofon: Part 5-6
INSERT INTO seven_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Tenorsaksofon';
INSERT INTO seven_part_system SELECT instrument_id, 6 FROM instrument WHERE instrument = 'Tenorsaksofon';

-- Barytonsaksofon: Part 7
INSERT INTO seven_part_system SELECT instrument_id, 7 FROM instrument WHERE instrument = 'Barytonsaksofon';

-- Horn: Part 4-6
INSERT INTO seven_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Horn';
INSERT INTO seven_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Horn';
INSERT INTO seven_part_system SELECT instrument_id, 6 FROM instrument WHERE instrument = 'Horn';

-- Baryton: Part 5-6
INSERT INTO seven_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Baryton';
INSERT INTO seven_part_system SELECT instrument_id, 6 FROM instrument WHERE instrument = 'Baryton';

-- Eufonium: Part 5-6
INSERT INTO seven_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Eufonium';
INSERT INTO seven_part_system SELECT instrument_id, 6 FROM instrument WHERE instrument = 'Eufonium';

-- Alttrombone: 4-5
INSERT INTO seven_part_system SELECT instrument_id, 4 FROM instrument WHERE instrument = 'Alttrombone';
INSERT INTO seven_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Alttrombone';
INSERT INTO seven_part_system SELECT instrument_id, 6 FROM instrument WHERE instrument = 'Alttrombone';

-- Trombone: Part 5-6
INSERT INTO seven_part_system SELECT instrument_id, 5 FROM instrument WHERE instrument = 'Trombone';
INSERT INTO seven_part_system SELECT instrument_id, 6 FROM instrument WHERE instrument = 'Trombone';

-- Basstrombone: Part 7
INSERT INTO seven_part_system SELECT instrument_id, 7 FROM instrument WHERE instrument = 'Basstrombone';

-- Tuba: Part 7
INSERT INTO seven_part_system SELECT instrument_id, 7 FROM instrument WHERE instrument = 'Tuba';

-- Bassgitar: Part 7
INSERT INTO seven_part_system SELECT instrument_id, 7 FROM instrument WHERE instrument = 'Bassgitar';
