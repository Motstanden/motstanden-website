INSERT INTO 
    wall_post(wall_post_id, wall_user_id, created_by, created_at, content)
VALUES
    (1, 14, 14, '2023-08-01 09:00:00',  'Hello World'),
    (2, 21, 21, '2023-08-24 09:00:00',
'I dag er fristen for å melde seg på forohminga!! Bli med å feire 5 år med Motstanden! https://forms.gle/AncFTgjEBK93TGKC6'),
    (3, 15, 15, '2023-09-14 15:30:00',  'Minner om at det er øvelse i dag! Vi har drikketillatelse!'),
    (4, 16, 16, '2023-09-20 18:45:00',  'Fint om alle kan kan stemme på hvilke dato det passer å ha genvors: https://motstanden.no/avstemninger'),
    (5, 17, 17, '2023-09-24 11:00:00',  'Noen som kan være edru anvarslig neste øvelse?'),
    (6, 19, 19, '2023-10-01 09:00:00',
'Etter over 150 dager nedetid og nok rekompileringer av sqlite til å varme opp hele gløshaugen er wikien ENDELIG OPPE IGJEN!!

wiki.motstanden.no'),
    (7, 18, 18, '2023-10-01 09:05:00', 'Hvordan lagger jeg ny artikkel på wiki-en?'),
    (8, 24, 16, '2023-10-05 11:00:00', 'Gratulerer med dagen! ❤️'),
    (9, 24, 32, '2023-10-05 11:30:00', 'Gratulerer med dagen! 🎉🎉'),
    (10, 20, 20, '2023-10-15 16:00:00',    
'Pull Request for generalvorssamling 2022 er ute: https://github.com/Motstanden/motstanden-statutter/pull/34

Les gjerne gjennom og kommenter! Det er viktig å si ifra hvis du er uenig i noe fra referatet, eller er uenig i hvordan referatet har blitt oversatt til statuttendringer.

Hvis det er ingen innsigelser så lukkes PR-en om en uke-ish 🙂'),

    (11, 14, 14, '2023-10-25 18:15:00',
'Det har kommet en ny funksjon på nettsiden! 
Nå kan du like ting! 
Test det ut her!');

INSERT INTO 
    wall_post_comment(wall_post_comment_id, wall_post_id, created_by, comment)
VALUES 
    -- Post 1: Hello World
    (1, 1, 15, 'Hello World!'),
    (2, 1, 16, 'Hello World!'),
    (3, 1, 17, 'Hello World!'),
    (4, 1, 18, 'Hello World!'),
    (5, 1, 19, 'Hello World!'),
    (6, 1, 20, 'Hello World!'),
    (7, 1, 21, 'Hello World!'),
    (8, 1, 22, 'Hello World!'),
    (9, 1, 23, 'Hello World!'),
    (10, 1, 24, 'Hello World!'),
    (11, 1, 25, 'Hello World!'),

    -- Post 2: I dag er fristen for å melde seg på forohminga!!...
    (12, 2, 23, 'Fredag går for meg men ikke på lørdag. Er betalingen bare for lørdagen? 🙂'),
    (13, 2, 24, 'Er vel helst lørdagen ja siden det er da vi har mat'),
    (14, 2, 23, 'Skal jeg da droppe forms og bare møte opp fredag? 😉'),
    (15, 2, 23, 'Ja, det er greit 🙂'),

    -- Post 3: Minner om at det er øvelse i dag! Vi har drikketillatelse!
    (16, 3, 20, 'Gira!'),

    -- Post 4: Fint om alle kan kan stemme på hvilke dato det passer å ha genvors: https://motstanden.no/avstemninger
    -- No comments

    -- Post 5: Noen som kan være edru anvarslig neste øvelse?
    (17, 5, 21, 'Jeg kan være edru!'), 

    -- Post 6: Etter over 150 dager nedetid og nok rekompileringer av sqlite til å varme opp hele gløshaugen er wikien ENDELIG OPPE IGJEN!!
    (18, 6, 23, 'HURRA! 🎉'),
    (19, 6, 24, 'Fantastisk!'),
    (20, 6, 25, 'Nydelig! 🤩'),

    -- Post 7: Hvordan lagger jeg ny artikkel på wiki-en?
    (21, 7, 22, 'F.eks ved å søke på en artikkel som ikke finnes'),

    -- Post 8-9: Gratulerer med dagen...
    (22, 8, 32, 'Tusen takk! ❤️'),
    (23, 9, 32, 'Takker og bukker 😊'),

    -- Post 10: Pull Request for generalvorssamling 2022 er ute...
    -- No comments

    -- Post 11: Det har kommet en ny funksjon på nettsiden...
    (24, 11, 14, 'Test gjerne også på denne kommentaren!');


INSERT INTO
    wall_post_like(wall_post_id, user_id, emoji_id)
VALUES 
    -- Post 6: Etter over 150 dager nedetid...
    (6, 27, 1),
    (6, 28, 2),
    (6, 29, 2),
    (6, 34, 2),

    -- Post 7: Hvordan lagger jeg ny artikkel på wiki-en?
    (7, 30, 3),
    (7, 31, 3),
    (7, 32, 3),

    -- Post 8-9: Gratulerer med dagen...
    (8, 24, 2),
    (8, 26, 4),
    (9, 24, 1),

    -- Post 11: Det har kommet en ny funksjon på nettsiden...
    (11, 14, 1),
    (11, 15, 1),
    (11, 16, 1),
    (11, 17, 1),
    (11, 18, 2),
    (11, 19, 2),
    (11, 20, 2),
    (11, 21, 2),
    (11, 22, 2),
    (11, 23, 2),
    (11, 24, 2),
    (11, 25, 2),
    (11, 26, 2),
    (11, 27, 3),
    (11, 28, 3),
    (11, 29, 3),
    (11, 30, 3),
    (11, 31, 3),
    (11, 32, 4),
    (11, 33, 4),
    (11, 34, 4),
    (11, 35, 4),
    (11, 36, 4),
    (11, 37, 5),
    (11, 38, 5),
    (11, 39, 6),
    (11, 40, 6);

INSERT INTO 
    wall_post_comment_like(wall_post_comment_id, user_id, emoji_id)
VALUES
    (24, 14, 1),
    (24, 15, 1),
    (24, 16, 1),
    (24, 17, 1),
    (24, 18, 2),
    (24, 19, 2),
    (24, 20, 2),
    (24, 21, 2),
    (24, 22, 2),
    (24, 23, 2),
    (24, 24, 2),
    (24, 25, 2),
    (24, 26, 2),
    (24, 27, 3),
    (24, 28, 3),
    (24, 29, 3),
    (24, 30, 3),
    (24, 31, 3),
    (24, 32, 4),
    (24, 33, 4),
    (24, 34, 4),
    (24, 35, 4),
    (24, 36, 4),
    (24, 37, 5),
    (24, 38, 5),
    (24, 39, 6),
    (24, 40, 6);