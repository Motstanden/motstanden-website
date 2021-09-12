--
-- PostgreSQL database dump
--

-- Dumped from database version 11.11
-- Dumped by pg_dump version 13.2

-- Started on 2021-04-24 11:55:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 235 (class 1255 OID 49468)
-- Name: check_can_delete(); Type: FUNCTION; Schema: public; Owner: doadmin
--

CREATE FUNCTION public.check_can_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	num_rows INTEGER;
BEGIN
	GET DIAGNOSTICS num_rows = ROW_COUNT;
	RAISE NOTICE 'NUM ROWS: %', num_rows;
	RAISE NOTICE 'OLD: %', OLD;
	RAISE NOTICE 'NEW: %', NEW;
	RETURN NULL;
END; $$;


ALTER FUNCTION public.check_can_delete() OWNER TO doadmin;

--
-- TOC entry 233 (class 1255 OID 38577)
-- Name: check_if_img_can_be_public(boolean, integer); Type: FUNCTION; Schema: public; Owner: doadmin
--

CREATE FUNCTION public.check_if_img_can_be_public(image_is_public boolean, album_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$ 
DECLARE
	album_is_public BOOL;
BEGIN
	SELECT 
		is_public 
	FROM 
		image_album_info 
	WHERE
	 	image_album_info_id = album_id
	INTO 
		album_is_public;
		
	IF 
		image_is_public = true 
	AND 
		album_is_public = false  
	THEN
		RAISE EXCEPTION 'A non public image album cannot have a public images. The given values where:
	1. image is public: %
	2. album is public: %', 
		image_is_public, album_is_public
		USING HINT = 'The only valid combinations of values for "image is public" and "album is public" are respectively: (true, true), (false, true), (false, false)';
	END IF;
END; $$;


ALTER FUNCTION public.check_if_img_can_be_public(image_is_public boolean, album_id integer) OWNER TO doadmin;

--
-- TOC entry 234 (class 1255 OID 47879)
-- Name: image_view_delete_proc(); Type: FUNCTION; Schema: public; Owner: doadmin
--

CREATE FUNCTION public.image_view_delete_proc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

	DELETE FROM 
		image_file
	WHERE
		image_file_id = OLD.image_file_id; 
		
	RETURN OLD;
END; $$;


ALTER FUNCTION public.image_view_delete_proc() OWNER TO doadmin;

--
-- TOC entry 236 (class 1255 OID 53114)
-- Name: image_view_insert_proc(); Type: FUNCTION; Schema: public; Owner: doadmin
--

CREATE FUNCTION public.image_view_insert_proc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
	-- needed for exception handling
	error_message VARCHAR;
	error_hint varchar;

	album_is_public BOOL;
	file_id INTEGER;
BEGIN

	-- Check that the user is not trying to insert values into invalid columns.
	IF 
		NEW.image_file_id IS NOT NULL 
	OR
		NEW.album_title IS NOT NULL 
	OR 
		NEW.album_is_public IS NOT NULL 
	THEN
		error_message 	:= 	'Insert operations are not allowed on the following columns:' 		||chr(10)||
							'		1. image_file_id'											||chr(10)||
							'		2. album_title'												||chr(10)||
							'		3. album_is_public'											||chr(10)||
							'	This is a safety mechanism to prevent logical mistakes';
		error_hint 		:= 	'Leave the columns out of the insert expression:'||chr(10)|| 
							'        INSERT INTO image_view(<args>, image_file_id, album_title, album_is_public) => INSERT INTO (<args>  )'	||chr(10)||
							'                                                   ^            ^                ^                         ^';	
		RAISE EXCEPTION '%', error_message USING HINT = error_hint;	
	END IF;
	
	-- Check that private albums does not contain public images.	
	PERFORM check_if_img_can_be_public(NEW.image_is_public::bool, NEW.album_id);
	
	
	-- Insert into the image file table. Get the affected row id.
	INSERT INTO 
		image_file(file) 
	VALUES 
		(new.image_file)
	RETURNING 
		image_file_id
	INTO
		file_id;

	-- Insert the rest of the data into the image table. Reference the affected rows in the image album table and the image file table.
	INSERT INTO 
		image(image_file_id, image_album_info_id, caption, is_public) 
	VALUES 
		(file_id, NEW.album_id, NEW.image_caption, NEW.image_is_public)
	RETURNING
		file_id 
	INTO 
		NEW.image_file_id;
	
	RETURN NEW;
END; $$;


ALTER FUNCTION public.image_view_insert_proc() OWNER TO doadmin;

--
-- TOC entry 230 (class 1255 OID 28139)
-- Name: image_view_update_proc(); Type: FUNCTION; Schema: public; Owner: doadmin
--

CREATE FUNCTION public.image_view_update_proc() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
	error_message VARCHAR;
	error_hint VARCHAR;

BEGIN
	-- Throw error if the user tried to set a image to public in a privae album.
	PERFORM check_if_img_can_be_public(NEW.image_is_public::bool, NEW.album_id);
	
	-- Throw error if the user tried to change an inapropriate column. 
	IF 
		OLD.image_file_id != NEW.image_file_id 
	OR
		OLD.image_file != NEW.image_file
	OR
		OLD.album_title != NEW.album_title
	OR
		OLD.album_is_public != NEW.album_is_public
	THEN
		error_message 	:= 'UPDATE statements are not allowed on the following columns: ' 		||chr(10)||
							'		1. image_file_id'											||chr(10)||
							'		2. image_file'												||chr(10)||
							'		3. album_title'												||chr(10)||
							'		4. album_is_public'											||chr(10)||
							'	This is a safety mechanism to prevent logical mistakes';
		error_hint 		:=	'Hint:	An image cannot be detached from an album. If you want to update the album info, you should update the image_album_info table.';
	
		RAISE EXCEPTION '%', error_message USING HINT = error_hint;
	END IF;

	UPDATE
		image
	SET
		caption = NEW.image_caption, 
		is_public = NEW.image_is_public,
		image_album_info_id = NEW.album_id
	WHERE
		image_file_id = NEW.image_file_id;	
		
	RETURN NEW;
END; $$;


ALTER FUNCTION public.image_view_update_proc() OWNER TO doadmin;

--
-- TOC entry 231 (class 1255 OID 32466)
-- Name: validate_public_image_info(boolean, boolean); Type: FUNCTION; Schema: public; Owner: doadmin
--

CREATE FUNCTION public.validate_public_image_info(image_is_public boolean, album_is_public boolean) RETURNS void
    LANGUAGE plpgsql
    AS $$ 
BEGIN
	IF 
		image_is_public = true 
	AND 
		album_is_public = false  
	THEN
		RAISE EXCEPTION 'A non public image album cannot have a public images. The given values where:
	1. image is public: %
	2. album is public: %', 
		image_is_public, album_is_public
		USING HINT = 'The only valid combinations of values for "image is public" and "album is public" are respectively: (true, true), (false, true), (false, false)';
	END IF;
END; $$;


ALTER FUNCTION public.validate_public_image_info(image_is_public boolean, album_is_public boolean) OWNER TO doadmin;

--
-- TOC entry 232 (class 1255 OID 34830)
-- Name: validate_public_image_info(boolean, integer); Type: FUNCTION; Schema: public; Owner: doadmin
--

CREATE FUNCTION public.validate_public_image_info(image_is_public boolean, album_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$ 
DECLARE
	album_is_public BOOL;
BEGIN
	SELECT 
		is_public 
	FROM 
		image_album_info 
	WHERE
	 	image_album_info_id = album_id
	INTO 
		album_is_public;
		
	IF 
		image_is_public = true 
	AND 
		album_is_public = false  
	THEN
		RAISE EXCEPTION 'A non public image album cannot have a public images. The given values where:
	1. image is public: %
	2. album is public: %', 
		image_is_public, album_is_public
		USING HINT = 'The only valid combinations of values for "image is public" and "album is public" are respectively: (true, true), (false, true), (false, false)';
	END IF;
END; $$;


ALTER FUNCTION public.validate_public_image_info(image_is_public boolean, album_id integer) OWNER TO doadmin;

SET default_tablespace = '';

--
-- TOC entry 216 (class 1259 OID 53090)
-- Name: image; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.image (
    image_file_id integer NOT NULL,
    image_album_info_id integer NOT NULL,
    caption character varying(1000),
    is_public boolean NOT NULL
);


ALTER TABLE public.image OWNER TO doadmin;

--
-- TOC entry 211 (class 1259 OID 53069)
-- Name: image_album_info; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.image_album_info (
    image_album_info_id integer NOT NULL,
    title character varying(255) NOT NULL,
    is_public boolean NOT NULL
);


ALTER TABLE public.image_album_info OWNER TO doadmin;

--
-- TOC entry 210 (class 1259 OID 53067)
-- Name: image_album_info_image_album_info_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.image_album_info_image_album_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.image_album_info_image_album_info_id_seq OWNER TO doadmin;

--
-- TOC entry 4018 (class 0 OID 0)
-- Dependencies: 210
-- Name: image_album_info_image_album_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.image_album_info_image_album_info_id_seq OWNED BY public.image_album_info.image_album_info_id;


--
-- TOC entry 213 (class 1259 OID 53077)
-- Name: image_file; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.image_file (
    image_file_id integer NOT NULL,
    file bytea
);


ALTER TABLE public.image_file OWNER TO doadmin;

--
-- TOC entry 212 (class 1259 OID 53075)
-- Name: image_file_image_file_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.image_file_image_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.image_file_image_file_id_seq OWNER TO doadmin;

--
-- TOC entry 4019 (class 0 OID 0)
-- Dependencies: 212
-- Name: image_file_image_file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.image_file_image_file_id_seq OWNED BY public.image_file.image_file_id;


--
-- TOC entry 215 (class 1259 OID 53088)
-- Name: image_image_album_info_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.image_image_album_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.image_image_album_info_id_seq OWNER TO doadmin;

--
-- TOC entry 4020 (class 0 OID 0)
-- Dependencies: 215
-- Name: image_image_album_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.image_image_album_info_id_seq OWNED BY public.image.image_album_info_id;


--
-- TOC entry 214 (class 1259 OID 53086)
-- Name: image_image_file_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.image_image_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.image_image_file_id_seq OWNER TO doadmin;

--
-- TOC entry 4021 (class 0 OID 0)
-- Dependencies: 214
-- Name: image_image_file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.image_image_file_id_seq OWNED BY public.image.image_file_id;


--
-- TOC entry 217 (class 1259 OID 53110)
-- Name: image_view; Type: VIEW; Schema: public; Owner: doadmin
--

CREATE VIEW public.image_view AS
 SELECT image.image_file_id,
    image_file.file AS image_file,
    image.caption AS image_caption,
    image.is_public AS image_is_public,
    image_album_info.image_album_info_id AS album_id,
    image_album_info.title AS album_title,
    image_album_info.is_public AS album_is_public
   FROM public.image,
    public.image_file,
    public.image_album_info
  WHERE ((image.image_file_id = image_file.image_file_id) AND (image.image_album_info_id = image_album_info.image_album_info_id));


ALTER TABLE public.image_view OWNER TO doadmin;

--
-- TOC entry 203 (class 1259 OID 18103)
-- Name: instrument; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.instrument (
    instrument_id integer NOT NULL,
    instrument character varying(50) NOT NULL
);


ALTER TABLE public.instrument OWNER TO doadmin;

--
-- TOC entry 202 (class 1259 OID 18101)
-- Name: instrument_instrument_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.instrument_instrument_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.instrument_instrument_id_seq OWNER TO doadmin;

--
-- TOC entry 4022 (class 0 OID 0)
-- Dependencies: 202
-- Name: instrument_instrument_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.instrument_instrument_id_seq OWNED BY public.instrument.instrument_id;


--
-- TOC entry 201 (class 1259 OID 17267)
-- Name: musicsheet; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.musicsheet (
    song_title character varying(100),
    song_isactive boolean,
    musicsheet_pdf bytea NOT NULL,
    musicsheet_key character varying(20),
    musicsheet_instrument character varying(100)
);


ALTER TABLE public.musicsheet OWNER TO doadmin;

--
-- TOC entry 4023 (class 0 OID 0)
-- Dependencies: 201
-- Name: TABLE musicsheet; Type: COMMENT; Schema: public; Owner: doadmin
--

COMMENT ON TABLE public.musicsheet IS 'This is the temporary sheet music archive.';


--
-- TOC entry 196 (class 1259 OID 16395)
-- Name: ping; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.ping (
    ping character varying(100)
);


ALTER TABLE public.ping OWNER TO doadmin;

--
-- TOC entry 209 (class 1259 OID 18662)
-- Name: quote; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.quote (
    quote_id integer NOT NULL,
    utterer character varying(100) NOT NULL,
    quote character varying(1000) NOT NULL
);


ALTER TABLE public.quote OWNER TO doadmin;

--
-- TOC entry 208 (class 1259 OID 18660)
-- Name: quote_quote_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.quote_quote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quote_quote_id_seq OWNER TO doadmin;

--
-- TOC entry 4024 (class 0 OID 0)
-- Dependencies: 208
-- Name: quote_quote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.quote_quote_id_seq OWNED BY public.quote.quote_id;


--
-- TOC entry 207 (class 1259 OID 18532)
-- Name: sheet_arcive; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.sheet_arcive (
    sheet_arcive_id integer NOT NULL,
    song_id integer NOT NULL,
    sheet_file bytea
);


ALTER TABLE public.sheet_arcive OWNER TO doadmin;

--
-- TOC entry 206 (class 1259 OID 18530)
-- Name: sheet_arcive_sheet_arcive_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.sheet_arcive_sheet_arcive_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sheet_arcive_sheet_arcive_id_seq OWNER TO doadmin;

--
-- TOC entry 4025 (class 0 OID 0)
-- Dependencies: 206
-- Name: sheet_arcive_sheet_arcive_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.sheet_arcive_sheet_arcive_id_seq OWNED BY public.sheet_arcive.sheet_arcive_id;


--
-- TOC entry 205 (class 1259 OID 18524)
-- Name: song; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.song (
    song_id integer NOT NULL,
    title character varying(50)
);


ALTER TABLE public.song OWNER TO doadmin;

--
-- TOC entry 200 (class 1259 OID 17253)
-- Name: song_lyric; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.song_lyric (
    song_lyric_id integer NOT NULL,
    title character varying(100),
    song_melody character varying(100),
    song_text_origin character varying(100) DEFAULT 'Ukjent'::character varying,
    song_description character varying(100),
    lyric_html_content text
);


ALTER TABLE public.song_lyric OWNER TO doadmin;

--
-- TOC entry 199 (class 1259 OID 17251)
-- Name: song_lyric_song_lyric_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.song_lyric_song_lyric_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.song_lyric_song_lyric_id_seq OWNER TO doadmin;

--
-- TOC entry 4026 (class 0 OID 0)
-- Dependencies: 199
-- Name: song_lyric_song_lyric_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.song_lyric_song_lyric_id_seq OWNED BY public.song_lyric.song_lyric_id;


--
-- TOC entry 204 (class 1259 OID 18522)
-- Name: song_song_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.song_song_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.song_song_id_seq OWNER TO doadmin;

--
-- TOC entry 4027 (class 0 OID 0)
-- Dependencies: 204
-- Name: song_song_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.song_song_id_seq OWNED BY public.song.song_id;


--
-- TOC entry 198 (class 1259 OID 16605)
-- Name: user_account; Type: TABLE; Schema: public; Owner: doadmin
--

CREATE TABLE public.user_account (
    user_account_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.user_account OWNER TO doadmin;

--
-- TOC entry 197 (class 1259 OID 16603)
-- Name: user_account_user_account_id_seq; Type: SEQUENCE; Schema: public; Owner: doadmin
--

CREATE SEQUENCE public.user_account_user_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_account_user_account_id_seq OWNER TO doadmin;

--
-- TOC entry 4028 (class 0 OID 0)
-- Dependencies: 197
-- Name: user_account_user_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: doadmin
--

ALTER SEQUENCE public.user_account_user_account_id_seq OWNED BY public.user_account.user_account_id;


--
-- TOC entry 3859 (class 2604 OID 53093)
-- Name: image image_file_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.image ALTER COLUMN image_file_id SET DEFAULT nextval('public.image_image_file_id_seq'::regclass);


--
-- TOC entry 3860 (class 2604 OID 53094)
-- Name: image image_album_info_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.image ALTER COLUMN image_album_info_id SET DEFAULT nextval('public.image_image_album_info_id_seq'::regclass);


--
-- TOC entry 3857 (class 2604 OID 53072)
-- Name: image_album_info image_album_info_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.image_album_info ALTER COLUMN image_album_info_id SET DEFAULT nextval('public.image_album_info_image_album_info_id_seq'::regclass);


--
-- TOC entry 3858 (class 2604 OID 53080)
-- Name: image_file image_file_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.image_file ALTER COLUMN image_file_id SET DEFAULT nextval('public.image_file_image_file_id_seq'::regclass);


--
-- TOC entry 3853 (class 2604 OID 18106)
-- Name: instrument instrument_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.instrument ALTER COLUMN instrument_id SET DEFAULT nextval('public.instrument_instrument_id_seq'::regclass);


--
-- TOC entry 3856 (class 2604 OID 18665)
-- Name: quote quote_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.quote ALTER COLUMN quote_id SET DEFAULT nextval('public.quote_quote_id_seq'::regclass);


--
-- TOC entry 3855 (class 2604 OID 18535)
-- Name: sheet_arcive sheet_arcive_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.sheet_arcive ALTER COLUMN sheet_arcive_id SET DEFAULT nextval('public.sheet_arcive_sheet_arcive_id_seq'::regclass);


--
-- TOC entry 3854 (class 2604 OID 18527)
-- Name: song song_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.song ALTER COLUMN song_id SET DEFAULT nextval('public.song_song_id_seq'::regclass);


--
-- TOC entry 3851 (class 2604 OID 17256)
-- Name: song_lyric song_lyric_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.song_lyric ALTER COLUMN song_lyric_id SET DEFAULT nextval('public.song_lyric_song_lyric_id_seq'::regclass);


--
-- TOC entry 3850 (class 2604 OID 16608)
-- Name: user_account user_account_id; Type: DEFAULT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.user_account ALTER COLUMN user_account_id SET DEFAULT nextval('public.user_account_user_account_id_seq'::regclass);


--
-- TOC entry 3880 (class 2606 OID 53074)
-- Name: image_album_info image_album_info_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.image_album_info
    ADD CONSTRAINT image_album_info_pkey PRIMARY KEY (image_album_info_id);


--
-- TOC entry 3882 (class 2606 OID 53085)
-- Name: image_file image_file_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.image_file
    ADD CONSTRAINT image_file_pkey PRIMARY KEY (image_file_id);


--
-- TOC entry 3884 (class 2606 OID 53099)
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (image_file_id);


--
-- TOC entry 3872 (class 2606 OID 18108)
-- Name: instrument instrument_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.instrument
    ADD CONSTRAINT instrument_pkey PRIMARY KEY (instrument_id);


--
-- TOC entry 3870 (class 2606 OID 17274)
-- Name: musicsheet musicsheet_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.musicsheet
    ADD CONSTRAINT musicsheet_pkey PRIMARY KEY (musicsheet_pdf);


--
-- TOC entry 3878 (class 2606 OID 18670)
-- Name: quote quote_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.quote
    ADD CONSTRAINT quote_pkey PRIMARY KEY (quote_id);


--
-- TOC entry 3876 (class 2606 OID 18540)
-- Name: sheet_arcive sheet_arcive_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.sheet_arcive
    ADD CONSTRAINT sheet_arcive_pkey PRIMARY KEY (sheet_arcive_id);


--
-- TOC entry 3864 (class 2606 OID 17266)
-- Name: song_lyric song_lyric_lyric_html_content_key; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.song_lyric
    ADD CONSTRAINT song_lyric_lyric_html_content_key UNIQUE (lyric_html_content);


--
-- TOC entry 3866 (class 2606 OID 17262)
-- Name: song_lyric song_lyric_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.song_lyric
    ADD CONSTRAINT song_lyric_pkey PRIMARY KEY (song_lyric_id);


--
-- TOC entry 3868 (class 2606 OID 17264)
-- Name: song_lyric song_lyric_title_key; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.song_lyric
    ADD CONSTRAINT song_lyric_title_key UNIQUE (title);


--
-- TOC entry 3874 (class 2606 OID 18529)
-- Name: song song_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.song
    ADD CONSTRAINT song_pkey PRIMARY KEY (song_id);


--
-- TOC entry 3862 (class 2606 OID 16613)
-- Name: user_account user_account_pkey; Type: CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (user_account_id);


--
-- TOC entry 3890 (class 2620 OID 53117)
-- Name: image_view on_delete; Type: TRIGGER; Schema: public; Owner: doadmin
--

CREATE TRIGGER on_delete INSTEAD OF DELETE ON public.image_view FOR EACH ROW EXECUTE PROCEDURE public.image_view_delete_proc();


--
-- TOC entry 3888 (class 2620 OID 53115)
-- Name: image_view on_insert; Type: TRIGGER; Schema: public; Owner: doadmin
--

CREATE TRIGGER on_insert INSTEAD OF INSERT ON public.image_view FOR EACH ROW EXECUTE PROCEDURE public.image_view_insert_proc();


--
-- TOC entry 3889 (class 2620 OID 53116)
-- Name: image_view on_update; Type: TRIGGER; Schema: public; Owner: doadmin
--

CREATE TRIGGER on_update INSTEAD OF UPDATE ON public.image_view FOR EACH ROW EXECUTE PROCEDURE public.image_view_update_proc();


--
-- TOC entry 3887 (class 2606 OID 53105)
-- Name: image image_image_album_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_image_album_info_id_fkey FOREIGN KEY (image_album_info_id) REFERENCES public.image_album_info(image_album_info_id);


--
-- TOC entry 3886 (class 2606 OID 53100)
-- Name: image image_image_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_image_file_id_fkey FOREIGN KEY (image_file_id) REFERENCES public.image_file(image_file_id) ON DELETE CASCADE;


--
-- TOC entry 3885 (class 2606 OID 18541)
-- Name: sheet_arcive sheet_arcive_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: doadmin
--

ALTER TABLE ONLY public.sheet_arcive
    ADD CONSTRAINT sheet_arcive_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.song(song_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- Completed on 2021-04-24 11:55:34

--
-- PostgreSQL database dump complete
--

