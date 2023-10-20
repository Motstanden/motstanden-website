INSERT INTO 
    event(event_id, title, start_date_time, end_date_time, created_by, updated_by, key_info, description)
VALUES
    (
        1, 
        'Fadderuke: Rebusløp',          
        '2022-08-16 12:00:00', 
        '2022-08-16 16:00:00',                
        1, 
        1, 
        json_array(
            json_object('key', 'Kategori:', 'value', 'Fadderuke'), 
            json_object('key', 'Sted:',     'value', 'Høgskoleparken'), 
            json_object('key', 'Antrekk:',  'value', 'Full uniform')
        ),
        'Beskrivelse av rebusløpet'
    ),
    (
        2, 
        'Hybel til hybel',   
        '2022-08-23 13:00:00', 
        null,                
        2, 
        2, 
        json_array(
            json_object('key', 'Kategori:', 'value', 'Fadderuke'), 
            json_object('key', 'Sted:',     'value', 'Bergstua'), 
            json_object('key', 'Antrekk:',  'value', 'Full uniform')
        ),
        'Beskrivelse av hybel til hybel'
    ),
    (
        3, 
        'Åpen øvelse',                  
        '2022-08-30 17:00:00', 
        '2022-08-31 00:00:00',  
        3, 
        1, 
        json_array(),             
        'Beskrivelse av åpen øvelse'
    ),
    (
        4, 
        'SMASH',                        
        '2022-09-16 07:00:00', 
        '2022-09-18 14:00',  
        4, 
        4, 
        json_array(
            json_object('key', 'Sted:',             'value', 'Ås'), 
            json_object('key', 'Påmeldingsfrist:',  'value', '1. September'), 
            json_object('key', 'Antrekk:',          'value', 'Full uniform')
        ),          
        'Beskrivelse av smash'
    ),
    (
        5, 
        'Rebusløp',          
        '2099-08-16 12:00:00', 
        '2099-08-16 16:00:00',               
        5, 
        5, 
        json_array(
            json_object('key', 'Kategori:', 'value', 'Fadderuke'), 
            json_object('key', 'Sted:',     'value', 'Høgskoleparken'), 
            json_object('key', 'Antrekk:',  'value', 'Full uniform')
        ),                                                            
        'Beskrivelse av rebusløpet'
    ),
    (
        6, 
        'Hybel til hybel',   
        '2099-08-23 13:00:00', 
        null,                
        1, 
        1, 
        json_array(
            json_object('key', 'Kategori:', 'value', 'Fadderuke'), 
            json_object('key', 'Sted:',     'value', 'Bergstua'), 
            json_object('key', 'Antrekk:',  'value', 'Full uniform')
        ),                                                                    
        'Beskrivelse av hybel til hybel'
    ),
    (
        7, 
        'Åpen øvelse',                  
        '2099-08-30 17:00:00', 
        '2099-08-31 00:00:00',
        1, 
        1, 
        json_array(),             
        'Beskrivelse av åpen øvelse'
    ),
    (
        8, 
        'SMASH',                        
        '2099-09-16 07:00:00', 
        '2099-09-18 14:00:00',  
        1, 
        2, 
        json_array(
            json_object('key', 'Sted:',             'value', 'Ås'), 
            json_object('key', 'Påmeldingsfrist:',  'value', '1. September'), 
            json_object('key', 'Oppmøte:',          'value', 'Hovedbygget på gløs'), 
            json_object('key', 'Antrekk:',          'value', 'Full uniform')
        ),         
        'Beskrivelse av smash'
    );

INSERT INTO 
    event_participant(event_id, user_id, participation_status_id)
VALUES 
    -- Fadderuka: Rebusløp
    (1, 14, 2),
    (1, 15, 2),
    (1, 16, 2),
    (1, 17, 2),
    (1, 18, 3),
    (1, 25, 3),
    (1, 26, 4),

    -- Fadderuke: Hybel til hybel
    (2, 21, 2),
    (2, 22, 2),
    (2, 23, 3),
    (2, 24, 3),
    (2, 25, 4),

    -- Åpen øvelse
    (3, 21, 2),
    (3, 22, 3),
    (3, 23, 4),
    (3, 24, 4),
    (3, 25, 4), 

    -- SMASH                
    (4, 21, 2),
    (4, 22, 2),
    (4, 23, 2),
    (4, 24, 2),
    (4, 25, 2),

    -- Fadderuka: Rebusløp
    (5, 14, 2),
    (5, 15, 2),
    (5, 16, 2),
    (5, 17, 2),
    (5, 21, 3),
    (5, 22, 3),
    (5, 23, 4),
    (5, 24, 4),
    (5, 25, 4),

    -- Fadderuke: Hybel til hybel
    (6, 17, 4),
    (6, 18, 4),
    (6, 21, 2),
    (6, 22, 2),
    (6, 23, 3),
    (6, 24, 3),
    (6, 25, 4),

    -- Åpen øvelse
    (7, 19, 2),
    (7, 20, 2),
    (7, 21, 2),
    (7, 22, 3),
    (7, 23, 4),
    (7, 24, 4),
    (7, 25, 4), 

    -- SMASH
    (8, 22, 2),                
    (8, 23, 2),                
    (8, 24, 2),                
    (8, 25, 2),                
    (8, 31, 2),
    (8, 32, 2),
    (8, 33, 2),
    (8, 34, 2),
    (8, 35, 2);


INSERT INTO
    event_comment (event_id, created_by, comment)
VALUES

    -- Rebusløp:
    (5, 14, 'Har vi planlagt hva vi skal gjøre?'),
    (5, 15, 'Nei, tror ikke det...'),
    (5, 16, 
'Foreslår at vi tar en liten workshop på kontoret en dag for å planlegge hva vi skal gjøre.
Når passer det for dere?'),
    (5, 14, 'Passer alle dager for meg 🙂'),    
    (5, 15, 'Jeg kan bare på onsdag...'),    
    (5, 16, 'Åkei! Da sier vi onsdag! Passer det å møtes kl 18:00?'),    
    (5, 15, 'Nice! Ja det passer bra 😄'),
    (5, 16, 'Den er brun 😏'),

    -- Hybel til hybel:
    (6, 17, 'Jeg er opptatt dessverre 😭'),
    (6, 18, 'Jeg har pappa på besøk den dagen, så jeg kan heller ikke komme 😔'),

    -- Åpen øvelse
    (7, 19, 
'Viktig å møte opp på dette folkens!
Vi må vise de hvor episk det er å være med i Motstanden!' ),
    (7, 20, 'Husk å ta med ekstra øl! 😄'),
    (7, 21, 'HYPE!!!'),

    -- SMASH
    (8, 22, 'Det her blir så sinnsykt bra! 😁'),
    (8, 23, 
'Til dere nye:
SMASH er noe av det gøyeste vi gjør!
Anbefaler på det sterkeste å bli med!'),
    (8, 24, 'Fins det noen oversikt over hvilke sanger vi trenger i marsjheftet?'),
    (8, 25, 'Ja, gå på noter -> repertoar'),
    (8, 24, 'Åja, haha ¯\_(ツ)_/¯');


