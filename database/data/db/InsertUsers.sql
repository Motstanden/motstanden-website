PRAGMA foreign_keys = ON;

INSERT INTO 
    user(user_id, is_deactivated, user_group_id, user_rank_id, user_status_id, start_date, first_name, middle_name, last_name, email)
VALUES

    -- Accounts reserved for *active* website users [ids: 1-99]
    (1,     0,      3,      6,      1,      '2018-09-01',       'Gustav',           '',                 'Kirchhoff',        'gustav.kirchhoff@proton.me'                ),                  
    (2,     0,      4,      6,      2,      '2018-09-01',       'Georg',            'Simon',            'Ohm',              'georg.simon.ohm@proton.me'                 ),                  
    (3,     0,      1,      5,      4,      '2018-09-01',       'Nikola',           '',                 'Tesla',            'nikola.tesla@tutanota.com'                 ),      
    (4,     0,      1,      5,      1,      '2018-09-01',       'Charles',          'Augustin',         'Coulumb',          'charles.augustin.coulumb@proton.me'        ),                     
    (5,     0,      4,      6,      2,      '2018-09-01',       'Albert',           '',                 'Einstein',         'albert.einstein@proton.me'                 ),            
    (6,     0,      2,      5,      1,      '2020-03-01',       'Isaac',            '',                 'Newton',           'isaac.newton@proton.me'                    ),            
    (7,     0,      1,      1,      4,      '2019-10-01',       'Niels',            '',                 'Bohr',             'niels.bohr@proton.me'                      ),         
    (8,     0,      1,      2,      1,      '2018-09-01',       'Michael',          '',                 'Faraday',          'michael.faraday@pm.me'                     ),               
    (9,     0,      1,      1,      5,      '2019-02-01',       'Richard',          '',                 'Feynman',          'richard.feynman@proton.me'                 ),            
    (10,    0,      1,      1,      5,      '2020-03-01',       'Werner',           '',                 'Heisenberg',       'werner.heisenberg@pm.me'                   ),                  
    (11,    0,      3,      4,      1,      '2020-10-01',       'Marie',            '',                 'Curie',            'marie.curie@proton.me'                     ),         
    (12,    0,      1,      1,      4,      '2018-09-01',       'Galileo',          '',                 'Galilei',          'galileo.galilei@proton.me'                 ),            
    (13,    0,      1,      2,      5,      '2019-02-01',       'Max',              '',                 'Planck',           'max.planck@proton.me'                      ),         
    (14,    0,      1,      3,      1,      '2020-03-01',       'Paul',             '',                 'Dirac',            'paul.dirac@tutanota.com'                   ),      
    (15,    0,      1,      3,      3,      '2019-10-01',       'James',            'Clerk',            'Maxwell',          'james.clerk.maxwell@proton.me'             ),                  
    (16,    0,      1,      3,      3,      '2018-09-01',       'Erwin',            '',                 'Schrödinger',      'erwin.schrodinger@proton.me'               ),                     
    (17,    0,      1,      2,      4,      '2020-02-01',       'Heinrich',         'Rudolf',           'Hertz',            'heinrich.rudolf.hertz@pm.me'               ),               
    (18,    0,      3,      1,      3,      '2020-02-01',       'Stephen',          '',                 'Hawking',          'stephen.hawking@proton.me'                 ),            
    (19,    0,      1,      5,      3,      '2018-09-01',       'Alessandro',       '',                 'Volta',            'alessandro.volta@proton.me'                ),            
    (20,    0,      1,      2,      4,      '2019-10-01',       'Carl',             'Friedrich',        'Gauss',            'carl.friedrich.gauss@pm.me'                ),               
    (21,    0,      1,      4,      3,      '2020-03-01',       'Leonhard',         '',                 'Euler',            'leonhard.euler@proton.me'                  ),
    (22,    0,      1,      3,      1,      '2018-09-01',       'Alfred',           '',                 'Nobel',            'alfred.nobel@tutanota.com'                 ),      
    (23,    0,      1,      4,      1,      '2020-01-01',       'Thomas',           '',                 'Edison',           'thomas.edison@proton.me'                   ),            
    (24,    0,      1,      4,      1,      '2019-03-01',       'Leonardo',         'di ser Piero',     'da Vinci',         'leonardo.di.ser.piero.da.vinci@proton.me'  ),                        
    (25,    0,      4,      4,      2,      '2020-01-01',       'Linus',            '',                 'Torvalds',         'linus.torvalds@proton.me'                  ),               
    (26,    0,      1,      4,      1,      '2018-09-01',       'Joseph',           '',                 'Fourier',          'joseph.fourier@pm.me'                      ),               
    (27,    0,      2,      6,      2,      '2019-02-01',       'Alan',             '',                 'Turing',           'alan.turing@proton.me'                     ),

    -- Accounts reserved for debugging by developers [ids: 200-299]
    (200,   0,      1,      3,      1,      '2018-09-01',        'Bidragsyter',      '',                 'Euler',            'contributor@motstanden.no'                 ),
    (201,   0,      2,      4,      1,      '2018-09-01',        'Redaktør',         '',                 'Turing',           'editor@motstanden.no'                      ),
    (202,   0,      3,      5,      1,      '2018-09-01',        'Admin',            '',                 'Kirchhoff',        'admin@motstanden.no'                       ),
    (203,   0,      4,      6,      1,      '2018-09-01',        'Super Admin',      '',                 'Ohm',              'superadmin@motstanden.no'                  ),


    -- Accounts reserved for testing [ids: 300-499]
    --      The data here must match the data in tests/utils/auth.ts
    --      If you update the data here, you must also update the data in tests/utils/auth.ts
    --
    -- Contributor [ids: 301-320]
    (301,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 1',     'test-contributor-1@motstanden.no'           ),
    (302,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 2',     'test-contributor-2@motstanden.no'           ),
    (303,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 3',     'test-contributor-3@motstanden.no'           ),
    (304,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 4',     'test-contributor-4@motstanden.no'           ),
    (305,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 5',     'test-contributor-5@motstanden.no'           ),
    (306,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 6',     'test-contributor-6@motstanden.no'           ),
    (307,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 7',     'test-contributor-7@motstanden.no'           ),
    (308,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 8',     'test-contributor-8@motstanden.no'           ),
    (309,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 9',     'test-contributor-9@motstanden.no'           ),
    (310,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 10',    'test-contributor-10@motstanden.no'          ),
    (311,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 11',    'test-contributor-11@motstanden.no'          ),
    (312,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 12',    'test-contributor-12@motstanden.no'          ),
    (313,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 13',    'test-contributor-13@motstanden.no'          ),
    (314,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 14',    'test-contributor-14@motstanden.no'          ),
    (315,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 15',    'test-contributor-15@motstanden.no'          ),
    (316,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 16',    'test-contributor-16@motstanden.no'          ),
    (317,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 17',    'test-contributor-17@motstanden.no'          ),
    (318,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 18',    'test-contributor-18@motstanden.no'          ),
    (319,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 19',    'test-contributor-19@motstanden.no'          ),
    (320,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'Contributor 20',    'test-contributor-20@motstanden.no'          ),

    -- Editor [ids: 321-340]
    (321,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 1',          'test-editor-1@motstanden.no'                ),
    (322,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 2',          'test-editor-2@motstanden.no'                ),
    (323,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 3',          'test-editor-3@motstanden.no'                ),
    (324,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 4',          'test-editor-4@motstanden.no'                ),
    (325,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 5',          'test-editor-5@motstanden.no'                ),
    (326,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 6',          'test-editor-6@motstanden.no'                ),
    (327,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 7',          'test-editor-7@motstanden.no'                ),
    (328,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 8',          'test-editor-8@motstanden.no'                ),
    (329,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 9',          'test-editor-9@motstanden.no'                ),
    (330,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 10',         'test-editor-10@motstanden.no'               ),
    (331,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 11',         'test-editor-11@motstanden.no'               ),
    (332,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 12',         'test-editor-12@motstanden.no'               ),
    (333,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 13',         'test-editor-13@motstanden.no'               ),
    (334,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 14',         'test-editor-14@motstanden.no'               ),
    (335,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 15',         'test-editor-15@motstanden.no'               ),
    (336,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 16',         'test-editor-16@motstanden.no'               ),
    (337,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 17',         'test-editor-17@motstanden.no'               ),
    (338,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 18',         'test-editor-18@motstanden.no'               ),
    (339,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 19',         'test-editor-19@motstanden.no'               ),
    (340,   0,      2,      4,      1,      '2018-09-01',        '__Test User',      '',                 'Editor 20',         'test-editor-20@motstanden.no'               ),

    -- Admin [ids: 341-360]
    (341,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 1 ',          'test-admin-1@motstanden.no'                ),
    (342,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 2 ',          'test-admin-2@motstanden.no'                ),
    (343,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 3 ',          'test-admin-3@motstanden.no'                ),
    (344,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 4 ',          'test-admin-4@motstanden.no'                ),
    (345,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 5 ',          'test-admin-5@motstanden.no'                ),
    (346,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 6 ',          'test-admin-6@motstanden.no'                ),
    (347,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 7 ',          'test-admin-7@motstanden.no'                ),
    (348,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 8 ',          'test-admin-8@motstanden.no'                ),
    (349,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 9 ',          'test-admin-9@motstanden.no'                ),
    (350,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 10',          'test-admin-10@motstanden.no'               ),
    (351,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 11',          'test-admin-11@motstanden.no'               ),
    (352,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 12',          'test-admin-12@motstanden.no'               ),
    (353,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 13',          'test-admin-13@motstanden.no'               ),
    (354,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 14',          'test-admin-14@motstanden.no'               ),
    (355,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 15',          'test-admin-15@motstanden.no'               ),
    (356,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 16',          'test-admin-16@motstanden.no'               ),
    (357,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 17',          'test-admin-17@motstanden.no'               ),
    (358,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 18',          'test-admin-18@motstanden.no'               ),
    (359,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 19',          'test-admin-19@motstanden.no'               ),
    (360,   0,      3,      5,      1,      '2018-09-01',        '__Test User',      '',                 'Admin 20',          'test-admin-20@motstanden.no'               ),

    -- Super Admin [ids: 361-380]
    (361,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 1',     'test-superadmin-1@motstanden.no'           ),
    (362,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 2',     'test-superadmin-2@motstanden.no'           ),
    (363,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 3',     'test-superadmin-3@motstanden.no'           ),
    (364,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 4',     'test-superadmin-4@motstanden.no'           ),
    (365,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 5',     'test-superadmin-5@motstanden.no'           ),
    (366,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 6',     'test-superadmin-6@motstanden.no'           ),
    (367,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 7',     'test-superadmin-7@motstanden.no'           ),
    (368,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 8',     'test-superadmin-8@motstanden.no'           ),
    (369,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 9',     'test-superadmin-9@motstanden.no'           ),
    (370,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 10',    'test-superadmin-10@motstanden.no'          ),
    (371,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 11',    'test-superadmin-11@motstanden.no'          ),
    (372,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 12',    'test-superadmin-12@motstanden.no'          ),
    (373,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 13',    'test-superadmin-13@motstanden.no'          ),
    (374,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 14',    'test-superadmin-14@motstanden.no'          ),
    (375,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 15',    'test-superadmin-15@motstanden.no'          ),
    (376,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 16',    'test-superadmin-16@motstanden.no'          ),
    (377,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 17',    'test-superadmin-17@motstanden.no'          ),
    (378,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 18',    'test-superadmin-18@motstanden.no'          ),
    (379,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 19',    'test-superadmin-19@motstanden.no'          ),
    (380,   0,      4,      6,      1,      '2018-09-01',        '__Test User',      '',                 'Super Admin 20',    'test-superadmin-20@motstanden.no'          ),

    -- Accounts reserved for tests\tests\auth.spec.ts [ids: 381-400]
    (381,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 1',      'test-auth-1@motstanden.no'                 ),
    (382,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 2',      'test-auth-2@motstanden.no'                 ),
    (383,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 3',      'test-auth-3@motstanden.no'                 ),
    (384,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 4',      'test-auth-4@motstanden.no'                 ),
    (385,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 5',      'test-auth-5@motstanden.no'                 ),
    (386,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 6',      'test-auth-6@motstanden.no'                 ),
    (387,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 7',      'test-auth-7@motstanden.no'                 ),
    (388,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 8',      'test-auth-8@motstanden.no'                 ),
    (389,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 9',      'test-auth-9@motstanden.no'                 ),
    (390,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 10',     'test-auth-10@motstanden.no'                ),
    (391,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 11',     'test-auth-11@motstanden.no'                ),
    (392,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 12',     'test-auth-12@motstanden.no'                ),
    (393,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 13',     'test-auth-13@motstanden.no'                ),
    (394,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 14',     'test-auth-14@motstanden.no'                ),
    (395,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 15',     'test-auth-15@motstanden.no'                ),
    (396,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 16',     'test-auth-16@motstanden.no'                ),
    (397,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 17',     'test-auth-17@motstanden.no'                ),
    (398,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 18',     'test-auth-18@motstanden.no'                ),
    (399,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 19',     'test-auth-19@motstanden.no'                ),
    (400,   0,      1,      3,      1,      '2018-09-01',        '__Test User',      '',                 'auth tests 20',     'test-auth-20@motstanden.no'                );