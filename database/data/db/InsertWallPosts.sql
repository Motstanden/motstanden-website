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

Hvis det er ingen innsigelser så lukkes PR-en om en uke-ish 🙂');

INSERT INTO 
    wall_post_comment(wall_post_id, created_by, comment)
VALUES 
    -- Post 1: Hello World
    (1, 15, 'Hello World!'),
    (1, 16, 'Hello World!'),
    (1, 17, 'Hello World!'),
    (1, 18, 'Hello World!'),
    (1, 19, 'Hello World!'),
    (1, 20, 'Hello World!'),
    (1, 21, 'Hello World!'),
    (1, 22, 'Hello World!'),
    (1, 23, 'Hello World!'),
    (1, 24, 'Hello World!'),
    (1, 25, 'Hello World!'),

    -- Post 2: I dag er fristen for å melde seg på forohminga!!...
    (2, 23, 'Fredag går for meg men ikke på lørdag. Er betalingen bare for lørdagen? 🙂'),
    (2, 24, 'Er vel helst lørdagen ja siden det er da vi har mat'),
    (2, 23, 'Skal jeg da droppe forms og bare møte opp fredag? 😉'),
    (2, 23, 'Ja, det er greit 🙂'),

    -- Post 3: Minner om at det er øvelse i dag! Vi har drikketillatelse!
    (3, 20, 'Gira!'),

    -- Post 4: Fint om alle kan kan stemme på hvilke dato det passer å ha genvors: https://motstanden.no/avstemninger
    -- No comments

    -- Post 5: Noen som kan være edru anvarslig neste øvelse?
    (5, 21, 'Jeg kan være edru!'), 

    -- Post 6: Etter over 150 dager nedetid og nok rekompileringer av sqlite til å varme opp hele gløshaugen er wikien ENDELIG OPPE IGJEN!!
    (6, 23, 'HURRA! 🎉'),
    (6, 24, 'Fantastisk!'),
    (6, 25, 'Nydelig! 🤩'),

    -- Post 7: Hvordan lagger jeg ny artikkel på wiki-en?
    (7, 22, 'F.eks ved å søke på en artikkel som ikke finnes'),

    -- Post 8-9: Gratulerer med dagen...
    (8, 32, 'Tusen takk! ❤️'),
    (9, 32, 'Takker og bukker 😊');

    -- Post 10: Pull Request for generalvorssamling 2022 er ute...
    -- No comments

