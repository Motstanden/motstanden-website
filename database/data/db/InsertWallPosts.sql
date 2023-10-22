INSERT INTO 
    wall_post(wall_post_id, wall_user_id, created_by, content)
VALUES
    (1, 14, 14, 'Hello World'),
    (2, 15, 15, 'Minner om at det er øvelse i dag! Vi har drikketillatelse!'),
    (3, 16, 16, 'Fint om alle kan kan stemme på hvilke dato det passer å ha genvors: https://motstanden.no/avstemninger'),
    (4, 17, 17, 'Noen som kan være edru anvarslig neste øvelse?'),
    (5, 19, 19, 
'Etter over 150 dager nedetid og nok rekompileringer av sqlite til å varme opp hele gløshaugen er wikien ENDELIG OPPE IGJEN!!

wiki.motstanden.no'),
    (6, 18, 18, 'Hvordan lagger jeg ny artikkel på wiki-en?'),
    (7, 20, 20,     
'Pull Request for generalvorssamling 2022 er ute: https://github.com/Motstanden/motstanden-statutter/pull/34

Les gjerne gjennom og kommenter! Det er viktig å si ifra hvis du er uenig i noe fra referatet, eller er uenig i hvordan referatet har blitt oversatt til statuttendringer.

Hvis det er ingen innsigelser så lukkes PR-en om en uke-ish 🙂'),
    (8, 21, 21, 
'I dag er fristen for å melde seg på forohminga!! Bli med å feire 5 år med Motstanden! https://forms.gle/AncFTgjEBK93TGKC6');

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

    -- Post 2: Minner om at det er øvelse i dag! Vi har drikketillatelse!
    (2, 20, 'Gira!'),

    -- Post 3: Fint om alle kan kan stemme på hvilke dato det passer å ha genvors: https://motstanden.no/avstemninger
    -- No comments

    -- Post 4: Noen som kan være edru anvarslig neste øvelse?
    (4, 21, 'Jeg kan være edru!'), 

    -- Post 5: Etter over 150 dager nedetid og nok rekompileringer av sqlite til å varme opp hele gløshaugen er wikien ENDELIG OPPE IGJEN!!
    (5, 23, 'HURRA! 🎉'),
    (5, 24, 'Fantastisk!'),
    (5, 25, 'Nydelig! 🤩'),

    -- Post 6: Hvordan lagger jeg ny artikkel på wiki-en?
    (6, 22, 'F.eks ved å søke på en artikkel som ikke finnes'),

    -- Post 7: Pull Request for generalvorssamling 2022 er ute...
    -- No comments

    -- Post 8: I dag er fristen for å melde seg på forohminga!!...
    (8, 23, 'Fredag går for meg men ikke på lørdag. Er betalingen bare for lørdagen? 🙂'),
    (8, 24, 'Er vel helst lørdagen ja siden det er da vi har mat'),
    (8, 23, 'Skal jeg da droppe forms og bare møte opp fredag? 😉'),
    (8, 23, 'Ja, det er greit 🙂');
