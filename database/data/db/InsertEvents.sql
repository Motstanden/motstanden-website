PRAGMA foreign_keys = ON;

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
    (1, 1, 2),
    (1, 2, 2),
    (1, 3, 2),
    (1, 4, 2),
    (1, 5, 3),
    (1, 6, 3),
    (1, 7, 4),

    -- Fadderuke: Hybel til hybel
    (2, 8, 2),
    (2, 9, 2),
    (2, 10, 3),
    (2, 11, 3),
    (2, 13, 4),

    -- Åpen øvelse
    (3, 8, 2),
    (3, 9, 3),
    (3, 10, 4),
    (3, 11, 4),
    (3, 13, 4), 

    -- SMASH                
    (4, 8, 2),
    (4, 9, 2),
    (4, 10, 2),
    (4, 11, 2),
    (4, 13, 2),

    -- Fadderuka: Rebusløp
    (5, 1, 2),
    (5, 2, 2),
    (5, 3, 2),
    (5, 4, 2),
    (5, 5, 3),
    (5, 6, 3),
    (5, 7, 4),
    (5, 8, 4),
    (5, 9, 4),

    -- Fadderuke: Hybel til hybel
    (6, 4, 4),
    (6, 5, 4),
    (6, 6, 2),
    (6, 7, 2),
    (6, 8, 3),
    (6, 9, 3),
    (6, 10, 4),

    -- Åpen øvelse
    (7, 6, 2),
    (7, 7, 2),
    (7, 8, 2),
    (7, 9, 3),
    (7, 10, 4),
    (7, 11, 4),
    (7, 12, 4), 

    -- SMASH
    (8, 9, 2),                
    (8, 10, 2),                
    (8, 11, 2),                
    (8, 12, 2),                
    (8, 13, 2),
    (8, 19, 2),
    (8, 20, 2),
    (8, 21, 2),
    (8, 22, 2);


INSERT INTO
    event_comment (event_id, created_by, comment)
VALUES

    -- Rebusløp:
    (5, 1, 'Har vi planlagt hva vi skal gjøre?'),
    (5, 2, 'Nei, tror ikke det...'),
    (5, 3, 
'Foreslår at vi tar en liten workshop på kontoret en dag for å planlegge hva vi skal gjøre.
Når passer det for dere?'),
    (5, 1, 'Passer alle dager for meg 🙂'),    
    (5, 2, 'Jeg kan bare på onsdag...'),    
    (5, 3, 'Åkei! Da sier vi onsdag! Passer det å møtes kl 18:00?'),    
    (5, 2, 'Nice! Ja det passer bra 😄'),
    (5, 3, 'Den er brun 😏'),

    -- Hybel til hybel:
    (6, 4, 'Jeg er opptatt dessverre 😭'),
    (6, 5, 'Jeg har pappa på besøk den dagen, så jeg kan heller ikke komme 😔'),

    -- Åpen øvelse
    (7, 6, 
'Viktig å møte opp på dette folkens!
Vi må vise de hvor episk det er å være med i Motstanden!' ),
    (7, 7, 'Husk å ta med ekstra øl! 😄'),
    (7, 8, 'HYPE!!!'),

    -- SMASH
    (8, 9, 'Det her blir så sinnsykt bra! 😁'),
    (8, 10, 
'Til dere nye:
SMASH er noe av det gøyeste vi gjør!
Anbefaler på det sterkeste å bli med!'),
    (8, 11, 'Fins det noen oversikt over hvilke sanger vi trenger i marsjheftet?'),
    (8, 12, 'Ja, gå på noter -> repertoar'),
    (8, 11, 'Åja, haha ¯\_(ツ)_/¯');


