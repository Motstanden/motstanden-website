INSERT INTO poll(poll_id, created_by, updated_by, type, title) VALUES
( 1, 5, 6, 'single', 'Kuleis eller Softis?'),
( 2, 6, 5, 'single', 'Blir du værende i Trondheim i sommer?'),
( 3, 5, 7, 'single', 'Hva er den beste julefilmen?'),
( 4, 6, 6, 'single', 'Hva var det kuleste på SMASH?');


INSERT INTO poll_option(poll_option_id, poll_id, text) VALUES
( 1, 1, 'Kuleis'),
( 2, 1, 'Softis'),

( 3, 2, 'Ja'),
( 4, 2, 'Nei'),
( 5, 2, 'Vet ikke'),

( 6, 3, 'Flåklypa'),
( 7, 3, 'Hjemme Alene'),
( 8, 3, 'Die Hard'),
( 9, 3, 'Harry Potter og de vises stein'),


( 10, 4, 'Spille musikk, tut'),
( 11, 4, 'Spritorientering'),
( 12, 4, 'Phanemil'),
( 13, 4, 'Å sprenge GRANAT!!'),
( 14, 4, 'At Motstanden vant nachspielet!');


INSERT INTO poll_vote(poll_option_id, user_id) VALUES 
-- Poll 1: Kuleis eller Softis?
( 1, 14 ),
( 1, 15 ),
( 1, 16 ),
( 1, 17 ),
( 1, 18 ),
( 1, 19 ),
( 1, 20 ),
( 1, 21 ),
( 1, 22 ),
( 1, 23 ),
( 1, 24 ),
( 1, 25 ),
( 1, 26 ),
( 1, 27 ),
( 1, 28 ),
( 1, 29 ),
( 1, 30 ),
( 2, 31 ),
( 2, 32 ),
( 2, 33 ),
( 2, 34 ),
( 2, 35 ),
( 2, 36 ),
( 2, 37 ),
( 2, 38 ),
( 2, 39 ),

-- Poll 2: Blir du værende i Trondheim i sommer?
( 3, 14 ),
( 3, 15 ),
( 3, 16 ),
( 3, 17 ),
( 4, 18 ),
( 4, 19 ),
( 4, 20 ),
( 4, 21 ),
( 4, 22 ),
( 4, 23 ),
( 4, 24 ),
( 4, 25 ),
( 4, 26 ),
( 4, 27 ),
( 4, 28 ),
( 5, 29 ),
( 5, 30 ),
( 5, 31 ),
( 5, 32 ),
( 5, 33 ),
( 5, 34 ),
( 5, 35 ),
( 5, 36 ),
( 5, 37 ),
( 5, 38 ),
( 5, 39 ),
( 5, 40 ),

-- Poll 3: Hva er den beste julefilmen?
( 6, 14 ),
( 6, 15 ),
( 6, 16 ),
( 6, 17 ),
( 7, 18 ),
( 7, 19 ),
( 7, 20 ),
( 7, 21 ),
( 7, 22 ),
( 7, 23 ),
( 7, 24 ),
( 7, 25 ),
( 7, 26 ),
( 7, 27 ),
( 7, 28 ),
( 8, 29 ),
( 8, 30 ),
( 8, 31 ),
( 8, 32 ),
( 8, 33 ),
( 8, 34 ),
( 8, 35 ),
( 8, 36 ),
( 8, 37 ),
( 8, 38 ),
( 8, 39 ),
( 8, 40 ),

-- Poll 5: Hva var det kuleste på SMASH?
( 10, 14 ),
( 10, 15 ),
( 10, 16 ),
( 10, 17 ),
( 10, 18 ),
( 10, 19 ),
( 10, 20 ),
( 10, 21 ),
( 10, 22 ),
( 10, 23 ),
( 10, 24 ),
( 10, 25 ),
( 11, 26 ),
( 11, 27 ),
( 11, 28 ),
( 11, 29 ),
( 12, 30 ),
( 12, 31 ),
( 12, 32 ),
( 12, 33 ),
( 12, 34 ),
( 13, 35 ),
( 13, 36 ),
( 13, 37 ),
( 13, 38 ),
( 13, 39 ),
( 13, 40 );


INSERT INTO
    poll_comment(poll_id, created_by, comment)
VALUES

-- Poll 1: Kuleis eller Softis?
    (1, 40, 'De som valgte softis har soft-tiss'),
    (1, 40, '( •_•)>⌐■-■'),
    (1, 40, '(⌐■_■)'),
    (1, 33, '🙄'),
    (1, 34, 'Nei, nei, nei...'),
    (1, 35, '(ㆆ_ㆆ)'),

-- pOLL 3: Hva er den beste julefilmen?
    (3, 34, 'Her er det kriminelt å ikke stemme Die Hard!'),
    (3, 25, 'Savner Lova Actually 😿'),
    (3, 16, 'Ildbegeret er mere julete en de vises stein. Fight me!'),

-- Poll 5: Hva var det kuleste på SMASH?
    (4, 23, 'Åååå, savner SMASH... :/'),
    (4, 26, 'Det beste var den episke bruremarsjen kl 0200 på Lørdag 😂'),
    (4, 27, 'Hahahahaha, ja! 😂😂'),
    (4, 30, 'Hva skjedde der?'),
    (4, 26, '( ͡~ ͜ʖ ͡°)');