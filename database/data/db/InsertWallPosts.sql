PRAGMA foreign_keys = ON;

INSERT INTO 
    wall_post(wall_post_id, wall_user_id, created_by, created_at, content)
VALUES
    (1, 1, 1,   '2023-08-01 09:00:00',  'Hello World'),
    (2, 8, 8,   '2023-08-24 09:00:00',
'I dag er fristen for å melde seg på forohminga!! Bli med å feire 5 år med Motstanden! https://forms.gle/AncFTgjEBK93TGKC6'),
    (3, 2, 2,   '2023-09-14 15:30:00',  'Minner om at det er øvelse i dag! Vi har drikketillatelse!'),
    (4, 3, 3,   '2023-09-20 18:45:00',  'Fint om alle kan kan stemme på hvilke dato det passer å ha genvors: https://motstanden.no/avstemninger'),
    (5, 4, 4,   '2023-09-24 11:00:00',  'Noen som kan være edru anvarslig neste øvelse?'),
    (6, 6, 6,   '2023-10-01 09:00:00',
'Etter over 150 dager nedetid og nok rekompileringer av sqlite til å varme opp hele gløshaugen er wikien ENDELIG OPPE IGJEN!!

wiki.motstanden.no'),
    (7, 5, 5,   '2023-10-01 09:05:00', 'Hvordan lagger jeg ny artikkel på wiki-en?'),
    (8, 11, 3,  '2023-10-05 11:00:00', 'Gratulerer med dagen! ❤️'),
    (9, 11, 16, '2023-10-05 11:30:00', 'Gratulerer med dagen! 🎉🎉'),
    (10, 8, 8,  '2023-10-15 16:00:00',    
'Pull Request for generalvorssamling 2022 er ute: https://github.com/Motstanden/motstanden-statutter/pull/34

Les gjerne gjennom og kommenter! Det er viktig å si ifra hvis du er uenig i noe fra referatet, eller er uenig i hvordan referatet har blitt oversatt til statuttendringer.

Hvis det er ingen innsigelser så lukkes PR-en om en uke-ish 🙂'),

    (11, 1, 1,  '2023-10-25 18:15:00',
'Det har kommet en ny funksjon på nettsiden! 
Nå kan du like ting! 
Test det ut her!');

INSERT INTO 
    wall_post_comment(wall_post_comment_id, wall_post_id, created_by, comment)
VALUES 
    -- Post 1: Hello World
    (1, 1, 2,   'Hello World!'),
    (2, 1, 3,   'Hello World!'),
    (3, 1, 4,   'Hello World!'),
    (4, 1, 5,   'Hello World!'),
    (5, 1, 6,   'Hello World!'),
    (6, 1, 7,   'Hello World!'),
    (7, 1, 8,   'Hello World!'),
    (8, 1, 9,   'Hello World!'),
    (9, 1, 10,  'Hello World!'),
    (10, 1, 11, 'Hello World!'),
    (11, 1, 12, 'Hello World!'),

    -- Post 2: I dag er fristen for å melde seg på forohminga!!...
    (12, 2, 10, 'Fredag går for meg men ikke på lørdag. Er betalingen bare for lørdagen? 🙂'),
    (13, 2, 11, 'Er vel helst lørdagen ja siden det er da vi har mat'),
    (14, 2, 10, 'Skal jeg da droppe forms og bare møte opp fredag? 😉'),
    (15, 2, 10, 'Ja, det er greit 🙂'),

    -- Post 3: Minner om at det er øvelse i dag! Vi har drikketillatelse!
    (16, 3, 7,  'Gira!'),

    -- Post 4: Fint om alle kan kan stemme på hvilke dato det passer å ha genvors: https://motstanden.no/avstemninger
    -- No comments

    -- Post 5: Noen som kan være edru anvarslig neste øvelse?
    (17, 5, 8, 'Jeg kan være edru!'), 

    -- Post 6: Etter over 150 dager nedetid og nok rekompileringer av sqlite til å varme opp hele gløshaugen er wikien ENDELIG OPPE IGJEN!!
    (18, 6, 10, 'HURRA! 🎉'),
    (19, 6, 11, 'Fantastisk!'),
    (20, 6, 12, 'Nydelig! 🤩'),

    -- Post 7: Hvordan lagger jeg ny artikkel på wiki-en?
    (21, 7, 9, 'F.eks ved å søke på en artikkel som ikke finnes'),

    -- Post 8-9: Gratulerer med dagen...
    (22, 8, 19, 'Tusen takk! ❤️'),
    (23, 9, 19, 'Takker og bukker 😊'),

    -- Post 10: Pull Request for generalvorssamling 2022 er ute...
    -- No comments

    -- Post 11: Det har kommet en ny funksjon på nettsiden...
    (24, 11, 1, 'Test gjerne også på denne kommentaren!');


INSERT INTO
    wall_post_like(wall_post_id, user_id, emoji_id)
VALUES 
    -- Post 6: Etter over 150 dager nedetid...
    (6, 14, 1),
    (6, 15, 2),
    (6, 16, 2),
    (6, 21, 2),

    -- Post 7: Hvordan lagger jeg ny artikkel på wiki-en?
    (7, 17, 2),
    (7, 18, 3),
    (7, 19, 4),

    -- Post 8-9: Gratulerer med dagen...
    (8, 11, 2),
    (8, 13, 4),
    (9, 25, 1),

    -- Post 11: Det har kommet en ny funksjon på nettsiden...
    (11, 1, 1),
    (11, 2, 1),
    (11, 3, 1),
    (11, 4, 1),
    (11, 5, 2),
    (11, 6, 2),
    (11, 7, 2),
    (11, 8, 2),
    (11, 9, 2),
    (11, 10, 2),
    (11, 11, 2),
    (11, 12, 2),
    (11, 13, 2),
    (11, 14, 3),
    (11, 15, 3),
    (11, 16, 3),
    (11, 17, 3),
    (11, 18, 3),
    (11, 19, 4),
    (11, 20, 4),
    (11, 21, 4),
    (11, 22, 4),
    (11, 23, 4),
    (11, 24, 5),
    (11, 25, 5),
    (11, 26, 6),
    (11, 27, 6);

INSERT INTO 
    wall_post_comment_like(wall_post_comment_id, user_id, emoji_id)
VALUES
    (24, 1, 1),
    (24, 2, 1),
    (24, 3, 1),
    (24, 4, 1),
    (24, 5, 2),
    (24, 6, 2),
    (24, 7, 2),
    (24, 8, 2),
    (24, 9, 2),
    (24, 10, 2),
    (24, 11, 2),
    (24, 12, 2),
    (24, 13, 2),
    (24, 14, 3),
    (24, 15, 3),
    (24, 16, 3),
    (24, 17, 3),
    (24, 18, 3),
    (24, 19, 4),
    (24, 20, 4),
    (24, 21, 4),
    (24, 22, 4),
    (24, 23, 4),
    (24, 24, 5),
    (24, 25, 5),
    (24, 26, 6),
    (24, 27, 6);