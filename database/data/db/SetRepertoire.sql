PRAGMA foreign_keys = ON;

UPDATE 
	song_title
SET is_repertoire = 1
WHERE 
	title IN
	( 
		'99 Luftballons',
		'A Swinging Safari',
		'Anchors Aweigh',
		'Another Brick in the Wall',
		'Axel F',
		'Bruremarsj',
		'Can-Can',
		'Careless Whisper',
		'Dixieland Strut',
		'Dyreparkens Røvermarsj',
		'Funkytown',
		'Gonna Fly Now',
		'Happy',
		'Holmenkollmarsj',
		'Ice Cream',
		'Killing in the Name',
		'Norge i Rødt Hvitt og Blått',
		'Nu Klinger',
		'Olsenbanden',
		'The Bare Necessities',
		'Through the Fire and Flames'
	);