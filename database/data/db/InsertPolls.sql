PRAGMA foreign_keys = ON;

INSERT INTO poll(poll_id, created_by, updated_by, type, title) VALUES
( 1, 1, 1, 'single', 'Kuleis eller Softis?'),
( 2, 2, 2, 'single', 'Blir du værende i Trondheim i sommer?'),
( 3, 3, 3, 'single', 'Hva er den beste julefilmen?'),
( 4, 4, 4, 'single', 'Hva var det kuleste på SMASH?');


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
( 1, 1 ),
( 1, 2 ),
( 1, 3 ),
( 1, 4 ),
( 1, 5 ),
( 1, 6 ),
( 1, 7 ),
( 1, 8 ),
( 1, 9 ),
( 1, 10 ),
( 1, 11 ),
( 1, 12 ),
( 1, 13 ),
( 1, 14 ),
( 1, 15 ),
( 1, 16 ),
( 1, 17 ),
( 2, 18 ),
( 2, 19 ),
( 2, 20 ),
( 2, 21 ),
( 2, 22 ),
( 2, 23 ),
( 2, 24 ),
( 2, 25 ),
( 2, 26 ),

-- Poll 2: Blir du værende i Trondheim i sommer?
( 3, 1 ),
( 3, 2 ),
( 3, 3 ),
( 3, 4 ),
( 4, 5 ),
( 4, 6 ),
( 4, 7 ),
( 4, 8 ),
( 4, 9 ),
( 4, 10 ),
( 4, 11 ),
( 4, 12 ),
( 4, 13 ),
( 4, 14 ),
( 4, 15 ),
( 5, 16 ),
( 5, 17 ),
( 5, 18 ),
( 5, 19 ),
( 5, 20 ),
( 5, 21 ),
( 5, 22 ),
( 5, 23 ),
( 5, 24 ),
( 5, 25 ),
( 5, 26 ),
( 5, 27 ),

-- Poll 3: Hva er den beste julefilmen?
( 6, 1 ),
( 6, 2 ),
( 6, 3 ),
( 6, 4 ),
( 7, 5 ),
( 7, 6 ),
( 7, 7 ),
( 7, 8 ),
( 7, 9 ),
( 7, 10 ),
( 7, 11 ),
( 7, 12 ),
( 7, 13 ),
( 7, 14 ),
( 7, 15 ),
( 8, 16 ),
( 8, 17 ),
( 8, 18 ),
( 8, 19 ),
( 8, 20 ),
( 8, 21 ),
( 8, 22 ),
( 8, 23 ),
( 8, 24 ),
( 8, 25 ),
( 8, 26 ),
( 8, 27 ),

-- Poll 5: Hva var det kuleste på SMASH?
( 10, 1 ),
( 10, 2 ),
( 10, 3 ),
( 10, 4 ),
( 10, 5 ),
( 10, 6 ),
( 10, 7 ),
( 10, 8 ),
( 10, 9 ),
( 10, 10 ),
( 10, 11 ),
( 10, 12 ),
( 11, 13 ),
( 11, 14 ),
( 11, 15 ),
( 11, 16 ),
( 12, 17 ),
( 12, 18 ),
( 12, 19 ),
( 12, 20 ),
( 12, 21 ),
( 13, 22 ),
( 13, 23 ),
( 13, 24 ),
( 13, 25 ),
( 13, 26 ),
( 13, 27 );


INSERT INTO
    poll_comment(poll_id, created_by, comment)
VALUES

-- Poll 1: Kuleis eller Softis?
    (1, 27, 'De som valgte softis har soft-tiss'),
    (1, 27, '( •_•)>⌐■-■'),
    (1, 27, '(⌐■_■)'),
    (1, 20, '🙄'),
    (1, 21, 'Nei, nei, nei...'),
    (1, 22, '(ㆆ_ㆆ)'),

-- pOLL 3: Hva er den beste julefilmen?
    (3, 21, 'Her er det kriminelt å ikke stemme Die Hard!'),
    (3, 12, 'Savner Lova Actually 😿'),
    (3, 3, 'Ildbegeret er mere julete en de vises stein. Fight me!'),

-- Poll 5: Hva var det kuleste på SMASH?
    (4, 10, 'Åååå, savner SMASH... :/'),
    (4, 13, 'Det beste var den episke bruremarsjen kl 0200 på Lørdag 😂'),
    (4, 14, 'Hahahahaha, ja! 😂😂'),
    (4, 17, 'Hva skjedde der?'),
    (4, 13, '( ͡~ ͜ʖ ͡°)');