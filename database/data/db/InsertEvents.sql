INSERT INTO 
    event(event_id, title, start_date_time, end_date_time, created_by, updated_by, key_info, description)
VALUES
    (
        1, 
        "Fadderuke: Rebusløp",          
        "2022-08-16 14:00:00", 
        "2022-08-16 18:00:00",                
        1, 
        1, 
        json_array(
            json_object("key", "Kategori:", "value", "Fadderuke"), 
            json_object("key", "Sted:",     "value", "Høgskoleparken"), 
            json_object("key", "Antrekk:",  "value", "Full uniform")
        ),
        "Beskrivelse av rebusløpet"
    ), (
        2, 
        "Hybel til hybel",   
        "2022-08-23 15:00:00", 
        null,                
        2, 
        2, 
        json_array(
            json_object("key", "Kategori:", "value", "Fadderuke"), 
            json_object("key", "Sted:",     "value", "Bergstua"), 
            json_object("key", "Antrekk:",  "value", "Full uniform")
        ),
        "Beskrivelse av hybel til hybel"
    ), (
        3, 
        "Åpen øvelse",                  
        "2022-08-30 19:00:00", 
        "2022-08-31 02:00:00",  
        3, 
        1, 
        json_array(),             
        "Beskrivelse av åpen øvelse"
    ), (
        4, 
        "SMASH",                        
        "2022-09-16 09:00:00", 
        "2022-09-18 16:00",  
        4, 
        4, 
        json_array(
            json_object("key", "Sted:",             "value", "Ås"), 
            json_object("key", "Påmeldingsfrist:",  "value", "1. September"), 
            json_object("key", "Antrekk:",          "value", "Full uniform")
        ),          
        "Beskrivelse av smash"
    ), (
        5, 
        "Rebusløp",          
        "2100-08-16 14:00:00", 
        "2100-08-16 18:00:00",               
        5, 
        5, 
        json_array(
            json_object("key", "Kategori:", "value", "Fadderuke"), 
            json_object("key", "Sted:",     "value", "Høgskoleparken"), 
            json_object("key", "Antrekk:",  "value", "Full uniform")
        ),                                                            
        "Beskrivelse av rebusløpet"
    ), (
        6, 
        "Hybel til hybel",   
        "2100-08-23 15:00:00", 
        null,                
        1, 
        1, 
        json_array(
            json_object("key", "Kategori:", "value", "Fadderuke"), 
            json_object("key", "Sted:",     "value", "Bergstua"), 
            json_object("key", "Antrekk:",  "value", "Full uniform")
        ),                                                                    
        "Beskrivelse av hybel til hybel"
    ), (
        7, 
        "Åpen øvelse",                  
        "2100-08-30 19:00:00", 
        "2100-08-31 02:00:00",
        1, 
        1, 
        json_array(),             
        "Beskrivelse av åpen øvelse"
    ), (
        8, 
        "SMASH",                        
        "2100-09-16 09:00:00", 
        "2022-09-18 16:00:00",  
        1, 
        2, 
        json_array(
            json_object("key", "Sted:",             "value", "Ås"), 
            json_object("key", "Påmeldingsfrist:",  "value", "1. September"), 
            json_object("key", "Oppmøte:",          "value", "Hovedbygget på gløs"), 
            json_object("key", "Antrekk:",          "value", "Full uniform")
        ),         
        "Beskrivelse av smash"
    );

INSERT INTO 
    event_participant(event_id, user_id, participation_status_id)
VALUES 
    -- Fadderuka: Rebusløp
    (1, 1, 2),
    (1, 2, 2),
    (1, 3, 3),
    (1, 4, 3),
    (1, 5, 3),

    -- Fadderuke: Hybel til hybel
    (2, 1, 1),
    (2, 2, 1),
    (2, 3, 2),
    (2, 4, 2),
    (2, 5, 3),

    -- Åpen øvelse
    (3, 1, 1),
    (3, 2, 2),
    (3, 3, 3),
    (3, 4, 3),
    (3, 5, 3), 

    -- SMASH                
    (4, 1, 1),
    (4, 2, 1),
    (4, 3, 1),
    (4, 4, 1),
    (4, 5, 1),

    -- Fadderuka: Rebusløp
    (5, 1, 2),
    (5, 2, 2),
    (5, 3, 3),
    (5, 4, 3),
    (5, 5, 3),

    -- Fadderuke: Hybel til hybel
    (6, 1, 1),
    (6, 2, 1),
    (6, 3, 2),
    (6, 4, 2),
    (6, 5, 3),

    -- Åpen øvelse
    (7, 1, 1),
    (7, 2, 2),
    (7, 3, 3),
    (7, 4, 3),
    (7, 5, 3), 

    -- SMASH                
    (8, 1, 1),
    (8, 2, 1),
    (8, 3, 1),
    (8, 4, 1),
    (8, 5, 1);