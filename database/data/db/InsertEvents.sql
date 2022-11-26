INSERT INTO 
    event(event_id, title, start_date_time, end_date_time, created_by, updated_by, key_info, description_html, description_json)
VALUES
    (
        1, 
        "Fadderuke: Rebusløp",          
        "2022-08-16 12:00:00", 
        "2022-08-16 16:00:00",                
        1, 
        1, 
        json_array(
            json_object("key", "Kategori:", "value", "Fadderuke"), 
            json_object("key", "Sted:",     "value", "Høgskoleparken"), 
            json_object("key", "Antrekk:",  "value", "Full uniform")
        ),
        "<div>Beskrivelse av rebusløpet</div>",
        json_array(
            json_object(
                "type", "DIV", 
                "children", json_array (
                    json_object(
                        "text", "Beskrivelse av rebusløpet"
                    )
                )
            )
        )
    ), (
        2, 
        "Hybel til hybel",   
        "2022-08-23 13:00:00", 
        null,                
        2, 
        2, 
        json_array(
            json_object("key", "Kategori:", "value", "Fadderuke"), 
            json_object("key", "Sted:",     "value", "Bergstua"), 
            json_object("key", "Antrekk:",  "value", "Full uniform")
        ),
        "Beskrivelse av hybel til hybel",
        json_array(
            json_object(
                "type", "DIV", 
                "children", json_array (
                    json_object(
                        "text", "Beskrivelse av hybel til hybel"
                    )
                )
            )
        )
    ), (
        3, 
        "Åpen øvelse",                  
        "2022-08-30 17:00:00", 
        "2022-08-31 00:00:00",  
        3, 
        1, 
        json_array(),             
        "Beskrivelse av åpen øvelse",
        json_array(
            json_object(
                "type", "DIV", 
                "children", json_array (
                    json_object(
                        "text", "Beskrivelse av åpen øvelse"
                    )
                )
            )
        )
    ), (
        4, 
        "SMASH",                        
        "2022-09-16 07:00:00", 
        "2022-09-18 14:00",  
        4, 
        4, 
        json_array(
            json_object("key", "Sted:",             "value", "Ås"), 
            json_object("key", "Påmeldingsfrist:",  "value", "1. September"), 
            json_object("key", "Antrekk:",          "value", "Full uniform")
        ),          
        "Beskrivelse av smash",
        json_array(
            json_object(
                "type", "DIV", 
                "children", json_array (
                    json_object(
                        "text", "Beskrivelse av smash"
                    )
                )
            )
        )
    ), (
        5, 
        "Rebusløp",          
        "2099-08-16 12:00:00", 
        "2099-08-16 16:00:00",               
        5, 
        5, 
        json_array(
            json_object("key", "Kategori:", "value", "Fadderuke"), 
            json_object("key", "Sted:",     "value", "Høgskoleparken"), 
            json_object("key", "Antrekk:",  "value", "Full uniform")
        ),                                                            
        "Beskrivelse av rebusløpet",
        json_array(
            json_object(
                "type", "DIV", 
                "children", json_array (
                    json_object(
                        "text", "Beskrivelse av rebusløpet"
                    )
                )
            )
        )
    ), (
        6, 
        "Hybel til hybel",   
        "2099-08-23 13:00:00", 
        null,                
        1, 
        1, 
        json_array(
            json_object("key", "Kategori:", "value", "Fadderuke"), 
            json_object("key", "Sted:",     "value", "Bergstua"), 
            json_object("key", "Antrekk:",  "value", "Full uniform")
        ),                                                                    
        "Beskrivelse av hybel til hybel",
        json_array(
            json_object(
                "type", "DIV", 
                "children", json_array (
                    json_object(
                        "text", "Beskrivelse av hyble tili hybel"
                    )
                )
            )
        )
    ), (
        7, 
        "Åpen øvelse",                  
        "2099-08-30 17:00:00", 
        "2099-08-31 00:00:00",
        1, 
        1, 
        json_array(),             
        "Beskrivelse av åpen øvelse",
        json_array(
            json_object(
                "type", "DIV", 
                "children", json_array (
                    json_object(
                        "text", "Beskrivelse av åpen øvelse"
                    )
                )
            )
        )
    ), (
        8, 
        "SMASH",                        
        "2099-09-16 07:00:00", 
        "2099-09-18 14:00:00",  
        1, 
        2, 
        json_array(
            json_object("key", "Sted:",             "value", "Ås"), 
            json_object("key", "Påmeldingsfrist:",  "value", "1. September"), 
            json_object("key", "Oppmøte:",          "value", "Hovedbygget på gløs"), 
            json_object("key", "Antrekk:",          "value", "Full uniform")
        ),         
        "Beskrivelse av smash",
        json_array(
            json_object(
                "type", "DIV", 
                "children", json_array (
                    json_object(
                        "text", "Beskrivelse av smash"
                    )
                )
            )
        )
    );

INSERT INTO 
    event_participant(event_id, user_id, participation_status_id)
VALUES 
    -- Fadderuka: Rebusløp
    (1, 1, 3),
    (1, 2, 3),
    (1, 3, 4),
    (1, 4, 4),
    (1, 5, 4),

    -- Fadderuke: Hybel til hybel
    (2, 1, 2),
    (2, 2, 2),
    (2, 3, 3),
    (2, 4, 3),
    (2, 5, 4),

    -- Åpen øvelse
    (3, 1, 2),
    (3, 2, 3),
    (3, 3, 4),
    (3, 4, 4),
    (3, 5, 4), 

    -- SMASH                
    (4, 1, 2),
    (4, 2, 2),
    (4, 3, 2),
    (4, 4, 2),
    (4, 5, 2),

    -- Fadderuka: Rebusløp
    (5, 1, 3),
    (5, 2, 3),
    (5, 3, 4),
    (5, 4, 4),
    (5, 5, 4),

    -- Fadderuke: Hybel til hybel
    (6, 1, 2),
    (6, 2, 2),
    (6, 3, 3),
    (6, 4, 3),
    (6, 5, 4),

    -- Åpen øvelse
    (7, 1, 2),
    (7, 2, 3),
    (7, 3, 4),
    (7, 4, 4),
    (7, 5, 4), 

    -- SMASH                
    (8, 1, 2),
    (8, 2, 2),
    (8, 3, 2),
    (8, 4, 2),
    (8, 5, 2);