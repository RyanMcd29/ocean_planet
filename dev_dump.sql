--
-- PostgreSQL database dump
--

\restrict qjLV7IZA14HLceZxKv9JHfTAKBUuLjW865jab4hd3WtzKrexuy3osY76cVlQuf4

-- Dumped from database version 16.9 (415ebe8)
-- Dumped by pg_dump version 16.10

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: category_badges; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.category_badges (
    id integer NOT NULL,
    user_id integer NOT NULL,
    category text NOT NULL,
    badge_name text NOT NULL,
    badge_icon text NOT NULL,
    unlocked_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.category_badges OWNER TO neondb_owner;

--
-- Name: category_badges_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.category_badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_badges_id_seq OWNER TO neondb_owner;

--
-- Name: category_badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.category_badges_id_seq OWNED BY public.category_badges.id;


--
-- Name: certifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.certifications (
    id integer NOT NULL,
    name text NOT NULL,
    agency text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.certifications OWNER TO neondb_owner;

--
-- Name: certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certifications_id_seq OWNER TO neondb_owner;

--
-- Name: certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.certifications_id_seq OWNED BY public.certifications.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    latitude real,
    longitude real
);


ALTER TABLE public.countries OWNER TO neondb_owner;

--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.countries_id_seq OWNER TO neondb_owner;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: dive_centers; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dive_centers (
    id integer NOT NULL,
    name text NOT NULL,
    dive_site_id integer NOT NULL,
    certification text,
    description text,
    contact_info text,
    icon_type text
);


ALTER TABLE public.dive_centers OWNER TO neondb_owner;

--
-- Name: dive_centers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.dive_centers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dive_centers_id_seq OWNER TO neondb_owner;

--
-- Name: dive_centers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.dive_centers_id_seq OWNED BY public.dive_centers.id;


--
-- Name: dive_log_species; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dive_log_species (
    id integer NOT NULL,
    dive_log_id integer NOT NULL,
    species_id integer NOT NULL,
    quantity integer,
    notes text
);


ALTER TABLE public.dive_log_species OWNER TO neondb_owner;

--
-- Name: dive_log_species_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.dive_log_species_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dive_log_species_id_seq OWNER TO neondb_owner;

--
-- Name: dive_log_species_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.dive_log_species_id_seq OWNED BY public.dive_log_species.id;


--
-- Name: dive_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dive_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    dive_site_id integer NOT NULL,
    dive_date timestamp without time zone NOT NULL,
    dive_time text NOT NULL,
    duration integer NOT NULL,
    max_depth real NOT NULL,
    avg_depth real,
    water_temp real,
    visibility real,
    current text,
    conditions text,
    description text,
    equipment text,
    certification_level text,
    buddy_name text,
    date_logged timestamp without time zone DEFAULT now()
);


ALTER TABLE public.dive_logs OWNER TO neondb_owner;

--
-- Name: dive_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.dive_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dive_logs_id_seq OWNER TO neondb_owner;

--
-- Name: dive_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.dive_logs_id_seq OWNED BY public.dive_logs.id;


--
-- Name: dive_maps; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dive_maps (
    id integer NOT NULL,
    dive_site_id integer NOT NULL,
    title text NOT NULL,
    description text,
    image_url text NOT NULL,
    uploaded_by integer NOT NULL,
    uploaded_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.dive_maps OWNER TO neondb_owner;

--
-- Name: dive_maps_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.dive_maps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dive_maps_id_seq OWNER TO neondb_owner;

--
-- Name: dive_maps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.dive_maps_id_seq OWNED BY public.dive_maps.id;


--
-- Name: dive_site_species; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dive_site_species (
    id integer NOT NULL,
    dive_site_id integer NOT NULL,
    species_id integer NOT NULL,
    frequency text
);


ALTER TABLE public.dive_site_species OWNER TO neondb_owner;

--
-- Name: dive_site_species_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.dive_site_species_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dive_site_species_id_seq OWNER TO neondb_owner;

--
-- Name: dive_site_species_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.dive_site_species_id_seq OWNED BY public.dive_site_species.id;


--
-- Name: dive_sites; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dive_sites (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    country text NOT NULL,
    latitude real NOT NULL,
    longitude real NOT NULL,
    difficulty text NOT NULL,
    min_depth integer,
    max_depth integer,
    min_visibility integer,
    max_visibility integer,
    min_temp integer,
    max_temp integer,
    current text,
    best_season text,
    peak_visibility_month text,
    conservation_status text,
    conservation_info text,
    main_image text,
    highlights text[],
    habitats text[],
    access_type text,
    entry_conditions text,
    surge_conditions text,
    seasonal_events text,
    unique_features text,
    user_experience_notes text,
    dive_site_layout text,
    conservation_park text,
    linked_lesson_id text
);


ALTER TABLE public.dive_sites OWNER TO neondb_owner;

--
-- Name: dive_sites_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.dive_sites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dive_sites_id_seq OWNER TO neondb_owner;

--
-- Name: dive_sites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.dive_sites_id_seq OWNED BY public.dive_sites.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.events (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone,
    location text NOT NULL,
    city text,
    dive_site_id integer,
    latitude real,
    longitude real,
    organizer_name text NOT NULL,
    description text NOT NULL,
    external_link text,
    cost text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.events OWNER TO neondb_owner;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO neondb_owner;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.lesson_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    lesson_id text NOT NULL,
    completed_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lesson_progress OWNER TO neondb_owner;

--
-- Name: lesson_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.lesson_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lesson_progress_id_seq OWNER TO neondb_owner;

--
-- Name: lesson_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.lesson_progress_id_seq OWNED BY public.lesson_progress.id;


--
-- Name: nearby_dive_sites; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.nearby_dive_sites (
    id integer NOT NULL,
    dive_site_id integer NOT NULL,
    nearby_dive_site_id integer NOT NULL,
    distance real
);


ALTER TABLE public.nearby_dive_sites OWNER TO neondb_owner;

--
-- Name: nearby_dive_sites_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.nearby_dive_sites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nearby_dive_sites_id_seq OWNER TO neondb_owner;

--
-- Name: nearby_dive_sites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.nearby_dive_sites_id_seq OWNED BY public.nearby_dive_sites.id;


--
-- Name: photos; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.photos (
    id integer NOT NULL,
    user_id integer NOT NULL,
    dive_site_id integer NOT NULL,
    image_url text NOT NULL,
    caption text,
    date_uploaded timestamp without time zone DEFAULT now(),
    species_tags jsonb
);


ALTER TABLE public.photos OWNER TO neondb_owner;

--
-- Name: photos_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.photos_id_seq OWNER TO neondb_owner;

--
-- Name: photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.photos_id_seq OWNED BY public.photos.id;


--
-- Name: post_comments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.post_comments (
    id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.post_comments OWNER TO neondb_owner;

--
-- Name: post_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.post_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_comments_id_seq OWNER TO neondb_owner;

--
-- Name: post_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.post_comments_id_seq OWNED BY public.post_comments.id;


--
-- Name: post_likes; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.post_likes (
    id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.post_likes OWNER TO neondb_owner;

--
-- Name: post_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.post_likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_likes_id_seq OWNER TO neondb_owner;

--
-- Name: post_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.post_likes_id_seq OWNED BY public.post_likes.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    content text NOT NULL,
    photo_url text,
    tags text[],
    location text,
    dive_site_id integer,
    species_spotted text[],
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now(),
    linked_lesson_id text
);


ALTER TABLE public.posts OWNER TO neondb_owner;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO neondb_owner;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    dive_site_id integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    date_posted timestamp without time zone DEFAULT now()
);


ALTER TABLE public.reviews OWNER TO neondb_owner;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO neondb_owner;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: species; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.species (
    id integer NOT NULL,
    common_name text NOT NULL,
    scientific_name text NOT NULL,
    description text,
    image_url text,
    conservation_status text,
    category text,
    habitats text[],
    fun_facts text[],
    domain text,
    kingdom text,
    phylum text,
    class text,
    "order" text,
    family text,
    genus text,
    region_found text,
    tags text[],
    dive_site_areas text[],
    seasonal_occurrence text,
    key_facts jsonb,
    mini_lesson_recommendations text
);


ALTER TABLE public.species OWNER TO neondb_owner;

--
-- Name: species_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.species_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.species_id_seq OWNER TO neondb_owner;

--
-- Name: species_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.species_id_seq OWNED BY public.species.id;


--
-- Name: user_certifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_certifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    certification_id integer NOT NULL,
    date_obtained date,
    certification_number text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_certifications OWNER TO neondb_owner;

--
-- Name: user_certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_certifications_id_seq OWNER TO neondb_owner;

--
-- Name: user_certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_certifications_id_seq OWNED BY public.user_certifications.id;


--
-- Name: user_favorites; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    dive_site_id integer NOT NULL,
    date_added timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_favorites OWNER TO neondb_owner;

--
-- Name: user_favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_favorites_id_seq OWNER TO neondb_owner;

--
-- Name: user_favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_favorites_id_seq OWNED BY public.user_favorites.id;


--
-- Name: user_spotted_species; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_spotted_species (
    id integer NOT NULL,
    user_id integer NOT NULL,
    species_id integer NOT NULL,
    dive_site_id integer NOT NULL,
    date_spotted timestamp without time zone DEFAULT now(),
    photo_id integer,
    notes text
);


ALTER TABLE public.user_spotted_species OWNER TO neondb_owner;

--
-- Name: user_spotted_species_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_spotted_species_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_spotted_species_id_seq OWNER TO neondb_owner;

--
-- Name: user_spotted_species_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_spotted_species_id_seq OWNED BY public.user_spotted_species.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    profile_picture text,
    bio text,
    country_id integer,
    name text,
    lastname text,
    preferred_activity text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: water_conditions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.water_conditions (
    id integer NOT NULL,
    dive_site_id integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL,
    water_temp real,
    visibility real,
    current_strength text,
    current_direction text,
    wave_height real,
    wind_speed real,
    wind_direction text,
    weather_conditions text,
    surface_conditions text,
    diving_conditions text,
    reported_by text,
    additional_notes text
);


ALTER TABLE public.water_conditions OWNER TO neondb_owner;

--
-- Name: water_conditions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.water_conditions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.water_conditions_id_seq OWNER TO neondb_owner;

--
-- Name: water_conditions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.water_conditions_id_seq OWNED BY public.water_conditions.id;


--
-- Name: category_badges id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.category_badges ALTER COLUMN id SET DEFAULT nextval('public.category_badges_id_seq'::regclass);


--
-- Name: certifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.certifications ALTER COLUMN id SET DEFAULT nextval('public.certifications_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: dive_centers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_centers ALTER COLUMN id SET DEFAULT nextval('public.dive_centers_id_seq'::regclass);


--
-- Name: dive_log_species id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_log_species ALTER COLUMN id SET DEFAULT nextval('public.dive_log_species_id_seq'::regclass);


--
-- Name: dive_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_logs ALTER COLUMN id SET DEFAULT nextval('public.dive_logs_id_seq'::regclass);


--
-- Name: dive_maps id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_maps ALTER COLUMN id SET DEFAULT nextval('public.dive_maps_id_seq'::regclass);


--
-- Name: dive_site_species id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_site_species ALTER COLUMN id SET DEFAULT nextval('public.dive_site_species_id_seq'::regclass);


--
-- Name: dive_sites id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_sites ALTER COLUMN id SET DEFAULT nextval('public.dive_sites_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: lesson_progress id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lesson_progress ALTER COLUMN id SET DEFAULT nextval('public.lesson_progress_id_seq'::regclass);


--
-- Name: nearby_dive_sites id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.nearby_dive_sites ALTER COLUMN id SET DEFAULT nextval('public.nearby_dive_sites_id_seq'::regclass);


--
-- Name: photos id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photos ALTER COLUMN id SET DEFAULT nextval('public.photos_id_seq'::regclass);


--
-- Name: post_comments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_comments ALTER COLUMN id SET DEFAULT nextval('public.post_comments_id_seq'::regclass);


--
-- Name: post_likes id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_likes ALTER COLUMN id SET DEFAULT nextval('public.post_likes_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: species id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.species ALTER COLUMN id SET DEFAULT nextval('public.species_id_seq'::regclass);


--
-- Name: user_certifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_certifications ALTER COLUMN id SET DEFAULT nextval('public.user_certifications_id_seq'::regclass);


--
-- Name: user_favorites id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_favorites ALTER COLUMN id SET DEFAULT nextval('public.user_favorites_id_seq'::regclass);


--
-- Name: user_spotted_species id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_spotted_species ALTER COLUMN id SET DEFAULT nextval('public.user_spotted_species_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: water_conditions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.water_conditions ALTER COLUMN id SET DEFAULT nextval('public.water_conditions_id_seq'::regclass);


--
-- Data for Name: category_badges; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.category_badges (id, user_id, category, badge_name, badge_icon, unlocked_at) FROM stdin;
\.


--
-- Data for Name: certifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.certifications (id, name, agency, description, created_at) FROM stdin;
1	Discover Scuba Diving	PADI	Introductory scuba experience in a pool or confined water	2025-11-04 14:37:42.92665
2	Scuba Diver	PADI	Basic certification for diving to 12 meters with a dive professional	2025-11-04 14:37:42.951082
3	Open Water Diver	PADI	Entry-level certification for diving to 18 meters	2025-11-04 14:37:42.97396
4	Adventure Diver	PADI	First step after Open Water, complete 3 adventure dives	2025-11-04 14:37:42.996602
5	Advanced Open Water Diver	PADI	Advanced certification for diving to 30 meters	2025-11-04 14:37:43.01946
6	Rescue Diver	PADI	Learn to prevent and manage dive emergencies	2025-11-04 14:37:43.043274
7	Divemaster	PADI	Professional level certification to guide certified divers	2025-11-04 14:37:43.064878
8	Open Water Scuba Instructor	PADI	Qualified to teach scuba diving courses	2025-11-04 14:37:43.087857
9	Master Scuba Diver Trainer	PADI	Specialty instructor certification	2025-11-04 14:37:43.111922
10	Course Director	PADI	Highest level PADI instructor certification	2025-11-04 14:37:43.135527
11	Enriched Air Diver	PADI	Nitrox specialty certification	2025-11-04 14:37:43.158779
12	Deep Diver	PADI	Specialty for diving to 40 meters	2025-11-04 14:37:43.181389
13	Wreck Diver	PADI	Specialty for exploring shipwrecks	2025-11-04 14:37:43.204464
14	Night Diver	PADI	Specialty for night and limited visibility diving	2025-11-04 14:37:43.227743
15	Underwater Photographer	PADI	Specialty for underwater photography	2025-11-04 14:37:43.251601
16	Peak Performance Buoyancy	PADI	Specialty for mastering buoyancy control	2025-11-04 14:37:43.274575
17	Try Scuba	SSI	Introductory scuba experience	2025-11-04 14:37:43.297649
18	Scuba Diver	SSI	Basic certification for guided diving to 12 meters	2025-11-04 14:37:43.320629
19	Open Water Diver	SSI	Entry-level certification for independent diving to 18 meters	2025-11-04 14:37:43.343879
20	Advanced Adventurer	SSI	Advanced skills development program	2025-11-04 14:37:43.366997
21	Advanced Open Water Diver	SSI	Advanced certification for diving to 30 meters	2025-11-04 14:37:43.395194
22	Stress & Rescue	SSI	Emergency response and rescue training	2025-11-04 14:37:43.416944
23	Dive Guide	SSI	Professional level certification	2025-11-04 14:37:43.438909
24	Divemaster	SSI	Leadership level certification	2025-11-04 14:37:43.461706
25	Open Water Instructor	SSI	Instructor level certification	2025-11-04 14:37:43.484601
26	Enriched Air Nitrox	SSI	Nitrox specialty certification	2025-11-04 14:37:43.507448
27	Deep Diving	SSI	Deep diving specialty to 40 meters	2025-11-04 14:37:43.530511
28	Wreck Diving	SSI	Wreck exploration specialty	2025-11-04 14:37:43.554502
29	Night Diving & Limited Visibility	SSI	Night diving specialty	2025-11-04 14:37:43.577725
30	Digital Underwater Photography	SSI	Underwater photography specialty	2025-11-04 14:37:43.600563
31	Open Water Scuba Diver	SDI	Entry-level recreational diving certification	2025-11-04 14:37:43.624413
32	Advanced Diver	SDI	Advanced recreational diving certification	2025-11-04 14:37:43.647433
33	Rescue Diver	SDI	Rescue and emergency response certification	2025-11-04 14:37:43.670541
34	Master Scuba Diver	SDI	Highest recreational diving certification	2025-11-04 14:37:43.694457
35	Divemaster	SDI	Professional level certification	2025-11-04 14:37:43.718047
36	Instructor	SDI	Instructor level certification	2025-11-04 14:37:43.740954
37	Nitrox Diver	SDI	Enriched air specialty	2025-11-04 14:37:43.763977
38	Deep Diver	SDI	Deep diving specialty	2025-11-04 14:37:43.786731
39	Wreck Diver	SDI	Wreck diving specialty	2025-11-04 14:37:43.811201
40	Night/Limited Visibility Diver	SDI	Night diving specialty	2025-11-04 14:37:43.834188
41	Nitrox Diver	TDI	Technical nitrox diving certification	2025-11-04 14:37:43.857994
42	Advanced Nitrox Diver	TDI	Advanced technical nitrox certification	2025-11-04 14:37:43.881356
43	Decompression Procedures Diver	TDI	Decompression diving certification	2025-11-04 14:37:43.904978
44	Extended Range Diver	TDI	Extended range technical diving	2025-11-04 14:37:43.927068
45	Trimix Diver	TDI	Trimix technical diving certification	2025-11-04 14:37:43.951542
46	Advanced Trimix Diver	TDI	Advanced trimix certification	2025-11-04 14:37:43.974479
47	CCR Diver	TDI	Closed circuit rebreather certification	2025-11-04 14:37:43.997293
48	Cave Diver	TDI	Technical cave diving certification	2025-11-04 14:37:44.020229
49	Technical Instructor	TDI	Technical diving instructor	2025-11-04 14:37:44.046529
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.countries (id, name, code, latitude, longitude) FROM stdin;
1	Australia	AU	-27	133
2	United States	US	39.8283	-98.5795
3	Canada	CA	56.1304	-106.3468
4	United Kingdom	GB	55.3781	-3.436
5	New Zealand	NZ	-40.9006	174.886
6	Germany	DE	51.1657	10.4515
7	France	FR	46.2276	2.2137
8	Japan	JP	36.2048	138.2529
9	Maldives	MV	3.2028	73.2207
10	Philippines	PH	12.8797	121.774
11	Indonesia	ID	-0.7893	113.9213
12	Thailand	TH	15.87	100.9925
13	Malaysia	MY	4.2105	101.9758
14	Egypt	EG	26.0975	31.1367
15	Mexico	MX	23.6345	-102.5528
16	Belize	BZ	17.1899	-88.4976
17	Costa Rica	CR	9.7489	-83.7534
18	Bahamas	BS	25.0343	-77.3963
19	South Africa	ZA	-30.5595	22.9375
20	Brazil	BR	-14.235	-51.9253
\.


--
-- Data for Name: dive_centers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dive_centers (id, name, dive_site_id, certification, description, contact_info, icon_type) FROM stdin;
1	GBR Dive Adventures	1	PADI 5-Star	Premier dive operator for Great Barrier Reef expeditions.	info@gbrdive.com	padi
2	Blue Hole Exploration	2	NAUI & TDI	Specialized in technical diving at the Great Blue Hole.	dive@bluehole-explore.com	naui
3	Tubbataha Voyages	3	PADI & SSI	Liveaboard expeditions to Tubbataha Reefs Natural Park.	booking@tubbatahavoyages.com	ssi
4	GBR Dive Adventures	7	PADI 5-Star	Premier dive operator for Great Barrier Reef expeditions.	info@gbrdive.com	padi
5	Blue Hole Exploration	8	NAUI & TDI	Specialized in technical diving at the Great Blue Hole.	dive@bluehole-explore.com	naui
6	Tubbataha Voyages	9	PADI & SSI	Liveaboard expeditions to Tubbataha Reefs Natural Park.	booking@tubbatahavoyages.com	ssi
7	GBR Dive Adventures	54	PADI 5-Star	Premier dive operator for Great Barrier Reef expeditions.	info@gbrdive.com	padi
8	Blue Hole Exploration	55	NAUI & TDI	Specialized in technical diving at the Great Blue Hole.	dive@bluehole-explore.com	naui
9	Tubbataha Voyages	56	PADI & SSI	Liveaboard expeditions to Tubbataha Reefs Natural Park.	booking@tubbatahavoyages.com	ssi
10	GBR Dive Adventures	61	PADI 5-Star	Premier dive operator for Great Barrier Reef expeditions.	info@gbrdive.com	padi
11	Blue Hole Exploration	62	NAUI & TDI	Specialized in technical diving at the Great Blue Hole.	dive@bluehole-explore.com	naui
12	Tubbataha Voyages	63	PADI & SSI	Liveaboard expeditions to Tubbataha Reefs Natural Park.	booking@tubbatahavoyages.com	ssi
\.


--
-- Data for Name: dive_log_species; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dive_log_species (id, dive_log_id, species_id, quantity, notes) FROM stdin;
\.


--
-- Data for Name: dive_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dive_logs (id, user_id, dive_site_id, dive_date, dive_time, duration, max_depth, avg_depth, water_temp, visibility, current, conditions, description, equipment, certification_level, buddy_name, date_logged) FROM stdin;
\.


--
-- Data for Name: dive_maps; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dive_maps (id, dive_site_id, title, description, image_url, uploaded_by, uploaded_at) FROM stdin;
\.


--
-- Data for Name: dive_site_species; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dive_site_species (id, dive_site_id, species_id, frequency) FROM stdin;
48	61	571	Common
49	61	572	Frequent
50	61	573	Occasional
51	62	573	Common
52	62	574	Rare
53	63	571	Abundant
54	63	572	Common
55	63	574	Occasional
56	64	575	Common
57	64	576	Common
58	64	577	Frequent
59	64	578	Occasional
60	64	579	Common
61	64	580	Frequent
62	64	581	Common
63	64	582	Abundant
64	64	583	Common
65	64	584	Frequent
66	65	575	Common
67	65	576	Occasional
68	65	581	Frequent
69	65	582	Common
70	65	583	Abundant
71	66	585	Common
72	66	586	Common
73	66	587	Frequent
74	66	588	Common
75	66	589	Common
76	66	590	Occasional
77	66	591	Frequent
78	66	592	Common
79	66	593	Occasional
80	66	594	Frequent
81	66	595	Frequent
82	66	572	Common
83	67	572	Abundant
84	67	599	Common
85	67	598	Common
86	67	596	Abundant
87	67	597	Abundant
88	67	586	Common
89	67	595	Occasional
90	67	600	Frequent
91	67	601	Frequent
92	67	589	Common
93	67	590	Occasional
94	67	602	Rare
95	68	575	Common
96	68	576	Common
97	68	582	Frequent
98	68	590	Common
99	68	583	Common
100	68	584	Frequent
101	69	579	Common
102	69	603	Common
103	69	604	Frequent
104	69	592	Common
105	69	605	Common
106	69	606	Frequent
107	68	607	Common
108	68	608	Common
109	68	609	Abundant
110	68	610	Common
111	68	151	Occasional
112	69	610	Common
113	69	17	Common
114	69	24	Common
115	69	35	Common
116	69	15	Common
117	69	154	Common
124	96	13	Common
125	96	614	Common
126	96	617	Common
127	96	61	Common
128	96	47	Common
129	96	112	Common
130	96	11	Uncommon
131	96	30	Uncommon
132	96	59	Common
133	96	163	Common
134	103	87	Common
135	103	47	Common
136	103	618	Common
137	103	59	Uncommon
138	103	619	Common
139	97	610	Common
140	97	84	Common
141	97	612	Common
142	97	162	Common
143	97	61	Uncommon
144	97	59	Uncommon
145	98	163	Common
146	98	160	Common
147	98	47	Common
148	98	112	Common
149	98	59	Common
150	98	616	Common
151	98	620	Common
152	98	63	Common
153	98	621	Uncommon
154	99	59	Common
155	99	47	Uncommon
156	99	112	Common
157	99	611	Common
158	99	622	Common
159	99	214	Uncommon
160	99	163	Common
161	99	160	Uncommon
162	99	66	Rare
163	99	30	Uncommon
164	100	87	Common
165	100	626	Common
166	100	625	Uncommon
167	101	9	Common
168	101	623	Common
169	101	68	Common
170	101	13	Common
171	101	624	Common
172	101	610	Common
173	101	288	Uncommon
174	101	627	Common
175	101	628	Common
176	91	623	Common
177	91	629	Common
178	91	614	Common
179	91	79	Common
180	91	9	Common
181	91	630	Common
182	91	631	Common
183	91	83	Uncommon
184	91	605	Common
185	91	632	Common
186	91	209	Uncommon
187	91	256	Common
188	102	633	Common
189	102	112	Common
190	102	61	Common
191	102	10	Uncommon
192	102	30	Common
193	102	59	Common
194	102	11	Uncommon
195	102	634	Rare
196	93	612	Common
197	93	610	Common
198	93	635	Uncommon
199	93	623	Common
200	93	636	Common
201	93	59	Common
202	93	112	Common
203	93	633	Uncommon
204	93	61	Common
205	93	30	Uncommon
206	93	66	Rare
207	93	524	Rare
208	94	87	Common
209	94	47	Uncommon
210	94	618	Common
211	94	59	Uncommon
212	104	9	Common
213	104	79	Common
214	104	214	Common
215	104	182	Common
216	104	633	Uncommon
217	104	59	Common
218	105	635	Common
219	105	614	Common
220	105	144	Common
221	105	47	Uncommon
222	105	112	Common
223	105	141	Uncommon
224	106	396	Common
225	106	163	Common
226	106	480	Common
227	106	116	Common
228	106	637	Common
229	106	79	Common
230	106	87	Common
231	106	635	Common
232	106	638	Common
233	106	81	Uncommon
234	106	617	Common
235	106	639	Common
236	106	640	Uncommon
237	106	633	Uncommon
238	106	47	Uncommon
239	107	79	Common
240	107	9	Common
241	107	614	Common
242	107	605	Common
243	107	182	Common
244	107	59	Common
245	108	633	Common
246	108	112	Common
247	108	61	Common
248	108	79	Common
249	108	30	Uncommon
250	108	59	Common
251	109	79	Common
252	109	87	Common
253	109	9	Common
254	109	605	Common
255	109	632	Common
256	109	256	Common
257	110	623	Common
258	110	629	Common
259	110	68	Common
260	110	614	Common
261	110	79	Common
262	110	288	Uncommon
263	110	59	Common
264	110	633	Uncommon
265	111	630	Common
266	111	631	Common
267	111	625	Common
268	111	47	Uncommon
269	111	141	Uncommon
270	111	83	Common
271	112	87	Common
272	112	626	Common
273	112	610	Common
274	112	112	Common
275	112	59	Common
276	112	47	Uncommon
283	113	79	Common
284	113	87	Common
285	113	625	Common
286	113	605	Common
287	113	163	Common
288	113	182	Common
289	114	87	Common
290	114	59	Common
291	114	603	Common
292	114	61	Common
293	114	182	Common
294	114	112	Uncommon
295	114	625	Common
296	114	79	Common
\.


--
-- Data for Name: dive_sites; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.dive_sites (id, name, description, location, country, latitude, longitude, difficulty, min_depth, max_depth, min_visibility, max_visibility, min_temp, max_temp, current, best_season, peak_visibility_month, conservation_status, conservation_info, main_image, highlights, habitats, access_type, entry_conditions, surge_conditions, seasonal_events, unique_features, user_experience_notes, dive_site_layout, conservation_park, linked_lesson_id) FROM stdin;
86	Tiputa Pass	Channel dive with strong currents and big marine life including sharks and rays	Rangiroa, French Polynesia	French Polynesia	-14.973	-147.628	Advanced	10	35	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Grey Sharks",Dolphins,"Manta Rays","Napoleon Wrasse"}	{Channel,"Open Ocean",Reef}	\N	\N	\N	\N	\N	\N	\N	\N	\N
87	Maaya Thila	Diving pinnacle with high biodiversity and excellent marine life viewing	South Ari Atoll, Maldives	Maldives	3.883	72.783	Intermediate	8	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"White-tip Sharks",Turtles,Trevally,Sweetlips}	{Pinnacle,Reef,"Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
88	Chimney - Poor Knights	Lava tube with kelp forest and arches showcasing unique temperate marine life	New Zealand	New Zealand	-35.483	174.733	Intermediate	10	35	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Eagle Rays",Snapper,"Moray Eels"}	{"Lava Tube","Kelp Forest","Rocky Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
89	Twin Peaks	Spectacular coral pinnacles rising from the deep with diverse marine life	Saxon Reef, Great Barrier Reef, Queensland	Australia	-16.7525	146.5361	Advanced	10	35	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Coral Pinnacles","Reef Sharks",Turtles,"Coral Gardens"}	{Pinnacle,"Coral Reef","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
90	Turtle Bommie	Famous for turtle encounters and beautiful coral formations	Saxon Reef, Great Barrier Reef, Queensland	Australia	-16.7525	146.5361	Intermediate	8	25	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Green Turtles","Hawksbill Turtles","Coral Bommies","Tropical Fish"}	{"Coral Bommie",Reef,"Sandy Bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
94	Cottesloe Reef	Shallow reef system perfect for beginners with colorful fish and easy access	Cottesloe, Perth, Western Australia	Australia	-31.9935	115.7574	Beginner	2	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Beginner Friendly","Colorful Fish","Shore Access","Reef Fish"}	{Reef,"Sandy Bottom","Rocky Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
95	Mindarie Marina	Sheltered marina dive with unique marine life and easy conditions	Mindarie, Perth, Western Australia	Australia	-31.6937	115.7093	Beginner	2	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{Sheltered,"Easy Conditions","Marine Life","Training Dives"}	{Marina,"Artificial Structures","Sandy Bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
91	Mettams Pool	Mettams Pool is Perth's premier shore diving location, offering a protected natural lagoon within Marmion Marine Park. This site combines easy access with spectacular marine biodiversity, featuring limestone reef formations, small caves, and sandy patches. The natural pool provides shelter from ocean swells, creating ideal conditions for photographers and marine life observers. Home to an incredible variety of fish species, invertebrates, and occasional visits from dolphins and sea lions, Mettams Pool showcases the best of Perth's temperate marine environment.	North Beach, Perth, Western Australia	Australia	-31.8673	115.752	Beginner	2	7	6	20	\N	\N	Minimal	\N	\N	\N	Located within Marmion Marine Park, a protected marine area. Divers and snorkelers must follow park regulations and avoid disturbing marine life. The sheltered lagoon provides important habitat for juvenile fish species.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Natural lagoon diving","Marmion Marine Park","Protected from swells","Outstanding biodiversity","Photographer's paradise"}	{"Natural limestone reef","Sheltered lagoon","Seagrass beds","Rocky reef structures"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
92	Woodman Point	Popular shore dive with excellent visibility and diverse marine life including rays and fish. Features good visibility, easy beach access, and abundant marine life. The sandy bottom and reef structure provide habitat for stingrays and various fish species.	Coogee, Perth, Western Australia	Australia	-32.2479	115.7563	Beginner	3	15	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Shore Dive",Stingrays,"Good Visibility","Marine Life","Easy Beach Access","Fish Species"}	{"Sandy Bottom","Reef Structure","Beach Access",Seagrass}	\N	\N	\N	\N	\N	\N	\N	\N	\N
61	Great Barrier Reef	The Great Barrier Reef is the world's largest coral reef system, stretching over 2,300 kilometers along the coast of Queensland, Australia. It offers some of the most spectacular diving experiences with its vibrant coral formations and diverse marine life.	Queensland, Australia	Australia	-16.7525	146.5361	Intermediate	15	30	10	30	24	30	Mild	June - November	September	Protected Area	The Great Barrier Reef is a UNESCO World Heritage site facing threats from climate change, water pollution, and coastal development. Visitors are required to follow strict guidelines to minimize impact.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Coral Gardens","Reef Sharks","Sea Turtles","Manta Rays","Wreck Diving","Night Dives"}	{"Coral Gardens",Drop-offs,"Sandy Flats","Sea Grass Beds"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
62	The Blue Hole	The Blue Hole in Belize is a world-renowned dive site that is part of the Lighthouse Reef System. This perfectly circular underwater sinkhole is over 300 meters across and 125 meters deep, offering divers a chance to see incredible marine life and geological formations.	Lighthouse Reef Atoll, Belize	Belize	17.3158	-87.5358	Advanced	5	40	15	40	26	29	Moderate	April - June	May	Marine Reserve	Part of the Belize Barrier Reef Reserve System, a UNESCO World Heritage site requiring careful conservation efforts to protect its unique ecosystem.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Deep Blue Waters",Stalactites,Sharks,"Coral Formations","Clear Visibility"}	{Sinkhole,"Reef Wall","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
63	Tubbataha Reefs	The Tubbataha Reefs Natural Park is a remote diving destination in the Sulu Sea, Philippines. This protected marine sanctuary features extraordinary biodiversity with pristine coral reefs and an abundance of marine life.	Sulu Sea, Philippines	Philippines	8.8011	119.8902	Advanced	10	40	20	45	26	30	Strong	March - June	April	UNESCO World Heritage Site	Strictly protected marine sanctuary with limited visitor access to preserve its unique marine ecosystem.	https://images.unsplash.com/photo-1533713692156-f70938dc0d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Pristine Corals",Sharks,"Manta Rays","Sea Turtles","Wall Diving"}	{"Coral Reef","Reef Wall",Atolls}	\N	\N	\N	\N	\N	\N	\N	\N	\N
64	Crystal Palace	Known for its brilliant limestone reef systems and elaborate swim-throughs. Divers have noted the unique phenomenon where bubbles rise through holes in the reef, resembling crystals.	Western Australia	Australia	-32.02668	115.54372	Beginner to Intermediate	8	18	\N	\N	\N	\N	Minimal to Moderate	\N	\N	\N	\N	\N	\N	{"Limestone Reef",Swim-throughs,"Rocky Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
65	Roe Reef	A renowned Western Australian dive site featuring diverse marine ecosystems and excellent underwater topography.	Perth	Australia	-31.97917	115.54	Intermediate	10	25	\N	\N	\N	\N	Light to Moderate	\N	\N	\N	\N	\N	\N	{"Rocky Reef","Kelp Forest","Sandy Bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
66	Twin Peaks	Two towering coral bommies rise from a white sandy bottom, surrounded by schools of reef fish and colorful corals. Located on Saxon Reef, this site offers excellent diving with varied depths and rich marine life.	Saxon Reef, Great Barrier Reef, Queensland	Australia	-16.466595	145.98332	Intermediate	10	30	15	30	24	29	Mild	May - November	September	Great Barrier Reef Marine Park	Part of the Great Barrier Reef Marine Park; follow 'no touch, no take' rules to protect this diverse ecosystem.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Twin Coral Bommies",Swim-throughs,"Reef Sharks","Sea Turtles","High Fish Density","Photography Opportunities"}	{"Coral Bommies","Sandy Bottom","Coral Gardens",Swim-throughs}	\N	\N	\N	\N	\N	\N	\N	\N	\N
67	Turtle Bommie	A prominent coral bommie rises from a white sandy seabed, surrounded by vibrant reef fish and visiting sea turtles. This site is famous for its cleaning stations and relaxed diving conditions.	Saxon Reef, Great Barrier Reef, Queensland	Australia	-27.42404	153.54848	Beginner	7	15	10	30	24	29	Mild	May - November	September	Great Barrier Reef Marine Park	Located within the Great Barrier Reef Marine Park; adherence to no-touch and no-take policies is mandatory to protect the delicate ecosystem.	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Cleaning Stations","Sea Turtles","Beginner Friendly","Coral Bommie","Diverse Marine Life","Relaxed Conditions"}	{"Coral Bommie","Sandy Bottom","Cleaning Stations","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
70	Barracuda Point	Strong currents with large pelagic fish schools including massive barracuda tornadoes	Sipadan Island, Malaysia	Malaysia	4.114	118.628	Advanced	5	40	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Barracuda Schools","Reef Sharks",Turtles,Jacks,"Bumphead Parrotfish"}	{Drop-off,"Reef Wall","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
71	Blue Corner	Dramatic wall dive with strong currents and incredible marine life diversity	Palau	Palau	7.258	134.244	Advanced	15	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{Sharks,Barracuda,"Eagle Rays","Napoleon Wrasse"}	{"Reef Wall",Drop-off,"Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
72	The Yongala	Historic shipwreck rich in marine biodiversity including manta rays and sharks	Queensland, Australia	Australia	-18.46	147.62	Intermediate	15	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Manta Rays","Sea Snakes",Turtles,"Bull Sharks","Tiger Sharks"}	{Wreck,"Open Ocean","Sandy Bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
73	Thistlegorm	WWII wreck with preserved cargo and abundant marine life	Red Sea, Egypt	Egypt	27.81	33.921	Advanced	16	33	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{Lionfish,Stonefish,Scorpionfish,Batfish}	{Wreck,Reef,"Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
74	Richelieu Rock	Horseshoe-shaped reef famous for macro and pelagic species including whale sharks	Thailand	Thailand	9.272	98.017	Intermediate	5	35	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Whale Sharks",Seahorses,"Harlequin Shrimp","Manta Rays"}	{Reef,"Rocky Reef","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
75	Aliwal Shoal	Shark diving hotspot with incredible marine diversity and ragged-tooth sharks	South Africa	South Africa	-30.221	30.798	Advanced	6	27	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Ragged-tooth Sharks",Turtles,"Eagle Rays","Manta Rays"}	{Reef,"Open Ocean","Sandy Bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
76	Silfra Fissure	Crystal clear freshwater dive between tectonic plates with incredible visibility	Iceland	Iceland	64.255	-21.12	Intermediate	10	18	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Crystal Clear Water","Tectonic Plates","Unique Geology"}	{Freshwater,Fissure,Rocky}	\N	\N	\N	\N	\N	\N	\N	\N	\N
77	Wolf and Darwin Islands	Diverse megafauna and large pelagics including hammerheads and whale sharks	Galápagos, Ecuador	Ecuador	1.678	-91.753	Advanced	10	40	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Hammerhead Sharks","Whale Sharks","Manta Rays",Turtles}	{"Open Ocean",Reef,Volcanic}	\N	\N	\N	\N	\N	\N	\N	\N	\N
78	SS President Coolidge	Massive luxury liner turned WWII troopship, now one of the worlds largest accessible wrecks	Vanuatu	Vanuatu	-15.522	167.222	Advanced	20	60	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{Lionfish,"Moray Eels","Ghost Pipefish"}	{Wreck,"Sandy Bottom","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
79	Bajo Alcyone	Seamount with large pelagic species and incredible biodiversity	Cocos Island, Costa Rica	Costa Rica	5.528	-87.033	Advanced	25	40	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Hammerhead Sharks","Manta Rays","Whale Sharks",Dolphins}	{Seamount,"Open Ocean",Reef}	\N	\N	\N	\N	\N	\N	\N	\N	\N
80	Manta Night Dive	Night dive with feeding manta rays attracted by plankton in the lights	Kona, Hawaii, USA	USA	19.64	-156	Beginner	10	15	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Manta Rays",Plankton,"Night Dive"}	{"Open Ocean","Sandy Bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
81	Cenote Angelita	Mystical underwater river effect from hydrogen sulfide layer creating ethereal diving experience	Tulum, Mexico	Mexico	20.123	-87.6	Advanced	10	60	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Hydrogen Sulfide Layer","Underwater River Effect",Cenote}	{Freshwater,Cenote,Cave}	\N	\N	\N	\N	\N	\N	\N	\N	\N
82	Tiger Beach	Shallow dive with tiger shark encounters and multiple shark species	Grand Bahama Island, Bahamas	Bahamas	26.783	-79.033	Advanced	6	12	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Tiger Sharks","Lemon Sharks","Nurse Sharks","Reef Sharks"}	{"Sandy Bottom","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
83	Secret Bay (Manic Muck)	Critter dive site great for macro photography with incredible small marine life	Anilao, Philippines	Philippines	13.75	120.9	Intermediate	3	21	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Mantis Shrimp",Nudibranchs,Gobies,Octopuses}	{Muck,"Sandy Bottom",Reef}	\N	\N	\N	\N	\N	\N	\N	\N	\N
84	Cape Kri	Record for most fish species in one dive with incredible biodiversity	Raja Ampat, Indonesia	Indonesia	-0.53	130.7	Intermediate	5	40	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{Barracudas,Sharks,Groupers,"Record Biodiversity"}	{Reef,Drop-off,"Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
85	1000 Steps	Beautiful coral gardens on a shore dive with diverse marine life	Bonaire	Netherlands Antilles	12.201	-68.292	Beginner	6	30	\N	\N	\N	\N	\N	\N	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{Parrotfish,Angelfish,"Sea Turtles",Sponges}	{"Coral Gardens",Reef,"Shore Dive"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
102	North Mole	North Mole at Fremantle offers year-round diving when other sites are blown out. This massive breakwater creates diverse diving environments from shallow rocky areas to deeper sandy patches. The site is famous for its resident population of smooth stingrays and Port Jackson sharks, particularly during winter months. The artificial reef formed by the rock wall supports a thriving ecosystem of fish, cephalopods, and invertebrates, making it a reliable dive site regardless of weather conditions.	Fremantle, Western Australia	Australia	-32.053307	115.743225	Advanced	5	9	2	10	\N	\N	Mild	\N	\N	\N	While not in a protected area, divers should respect the marine environment and historic wreck site. Exercise caution with fishing lines and boat traffic near Fremantle Harbour.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"All-weather diving","Stingray encounters","Port Jackson sharks in winter","Breakwater protection","Diverse habitats"}	{"Artificial reef on wreck","Rocky structures","Seagrass beds","Sandy patches"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
100	Long Jetty	Long Jetty provides an extensive artificial reef system along its historic timber pylons. This sheltered site offers easy diving conditions with a wealth of marine life concentrated around the jetty structures. The pylons, encrusted with colorful sponges, ascidians, and soft corals, create a vertical reef environment that attracts everything from tiny nudibranchs to large schools of fish. Popular for both day and night diving, the jetty offers reliable encounters with cuttlefish, octopuses, and a variety of macro subjects.	Fremantle, Western Australia	Australia	-32.0592	115.741	Beginner	3	5	3	8	\N	\N	Minimal	\N	\N	\N	Historic site protected under the Maritime Archaeology Act of 1973. Divers must not disturb the site or collect artifacts. The jetty remnants provide limited habitat for marine life.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Historic timber jetty","Vertical reef diving","Excellent macro life","Night dive favorite","Sheltered conditions"}	{"Artificial reef structure","Sandy bottom","Sparse seagrass beds","Jetty pylons"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
103	Palm Beach Jetty	A 125-meter-long jetty in Rockingham's Mangles Bay, perfect for novice divers and snorkelers. The shallow depths and easy shore access make it ideal for beginners, with artificial reef habitat created by jetty pylons and surrounding debris.	Rockingham, Western Australia	Australia	-32.276485	115.71997	Beginner	2	15	6	20	18	24	Mild	Year-round, best in calm conditions	\N	\N	Not within a designated marine protected area. Respect local regulations, avoid disturbing marine life, and be cautious of fishing lines and boat traffic.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Shore dive access","Beginner-friendly depths","Jetty structure exploration","Sandy beach entry"}	{"Artificial Reef","Sandy Bottom","Jetty Structure"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
98	Jervoise Bay Groin	Man-made rock groins and concrete jetty structures creating a sheltered artificial reef environment. Ideal during poor weather conditions with depths up to 10m. Located near Cockburn Power Boat Club.	Woodman Point, Jervoise Bay	Australia	-32.1396	115.7612	Beginner	2	10	5	12	18	24	Mild	Excellent during poor weather due to shelter	\N	\N	Not in a marine protected area. Respect local regulations, avoid disturbing marine life, and be cautious of fishing lines and boat traffic.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Sheltered dive site","Artificial reef structures","Good in poor weather","Rich coral growth"}	{"Artificial Reef","Rock Groin","Jetty Structure"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
101	MAAC	MAAC (Marmion Angling & Aquatic Club) provides access to some of Perth's most spectacular reef diving within Marmion Marine Park. This shore dive site offers dramatic limestone formations with caves, swim-throughs, and ledges that create a playground for divers. The protected marine park status ensures healthy populations of fish, including large schools of buffalo bream, while the complex reef structure supports diverse invertebrate life. Known for excellent visibility and varied topography, MAAC is where divers can experience the best of Perth's temperate reef systems.	Fremantle, Western Australia	Australia	-31.8392	115.7489	Beginner	5	7	6	20	\N	\N	Minimal	\N	\N	\N	Located within Marmion Marine Park, Western Australia's first marine park established in 1987. Divers must adhere to park regulations and avoid disturbing marine life or habitats. The reef supports diverse species including Weedy Sea Dragons.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Marmion Marine Park","Limestone caves and swim-throughs","Protected reef system","Excellent visibility","Diverse topography"}	{"Natural limestone reef","Seagrass beds","Rocky overhangs","Reef inlets"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
68	AMMO Jetty	A shore‑based jetty dive located near Fremantle, Western Australia. The concrete jetty features encrusted pylons with diverse macro‑life including leatherjackets, pygmy filefish, crested morwong schools, boxfish, flatworms, anemones, and occasional rays. Night dives offer encounters with dolphins and sea lions.	Cockburn Sound, Western Australia	Australia	-32.1244	115.7572	Beginner	3	9	5	15	16	22	Minimal	November - April	January	Artificial Reef	Part of Western Australia's artificial reef program. Divers must follow no-take policies and be mindful of the marine sanctuary status.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Macro Photography",Leatherjackets,"Pygmy Filefish","Crested Morwong",Boxfish,Flatworms,Anemones,"Night Diving",Dolphins,"Sea Lions"}	{Jetty,"Artificial Reef","Silty Rubble","Pylon Structure"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
109	The Coombe Reserve	The Coombe Reserve features accessible shore diving with interesting reef formations and marine life. This site offers various entry points and depth options suitable for different experience levels.	Cockburn Sound, Western Australia	Australia	-32.332973	115.70942	Beginner	2	10	5	15	\N	\N	Minimal to Mild	\N	\N	\N	Popular local dive site requiring respect for the marine environment. The reef systems support diverse communities of fish and invertebrates.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Multiple entry points","Varied depth options","Reef formations","Easy shore access","Family-friendly site"}	{"Limestone reef","Sandy areas","Rock pools","Shallow reef flats"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
110	Trigg Beach	Trigg Beach offers excellent shore diving with natural limestone reef formations, caves, and swim-throughs. This popular site within Marmion Marine Park provides diverse diving experiences from shallow snorkeling to deeper reef exploration.	Trigg, Western Australia	Australia	-31.872557	115.760086	Intermediate	2	12	8	20	\N	\N	Mild to Moderate	\N	\N	\N	Located within Marmion Marine Park. Divers must follow park regulations and respect the protected reef environment. The limestone formations provide critical habitat for diverse marine species.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Limestone caves and swim-throughs","Marmion Marine Park","Popular surf and dive spot","Natural reef formations","Diverse marine life"}	{"Limestone reef","Caves and overhangs","Kelp forests","Sandy channels"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
111	Waikiki Beach	Waikiki Beach in Safety Bay offers protected shore diving with easy access and shallow depths perfect for beginners. This family-friendly site features seagrass beds and sandy areas that support a variety of marine life.	Waikiki, Western Australia	Australia	-32.31	115.75	Beginner	2	6	5	12	\N	\N	Minimal	\N	\N	\N	Popular recreational beach requiring environmental awareness. Seagrass beds provide important habitat and nursery areas for juvenile fish - avoid damaging these sensitive areas.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Protected beach diving","Perfect for beginners","Seagrass meadows",Family-friendly,"Easy beach access"}	{"Seagrass beds","Sandy bottom","Shallow reef patches","Protected bay"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
114	Woodman Point Groin	Woodman Point Groin offers a go-to beginner site that's calm, shallow, and safe. This man-made rock groin creates diverse diving opportunities with both shallow snorkeling areas and deeper sections featuring small ledges and sandy pockets. A local favourite for macro photography and night dives, the site provides reliable sightings of nudibranchs and cryptic marine life. The groin structure separates Jervoise Bay and Cockburn Sound, creating protected conditions ideal for training dives, gear tests, and honing buoyancy skills.	Coogee, Western Australia	Australia	-32.13658	115.74519	Beginner	2	7	3	8	\N	\N	Mild	\N	\N	\N	Not within a marine protected area, but WA dive code of conduct applies. Avoid disturbing sediment or handling marine life. Be aware of boat traffic and use surface markers when diving near boat lanes.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Macro lover's paradise","Easy shore access","Night dive favourite","Training site","Cryptic species haven"}	{"Artificial reef (groin rocks)","Sandy bottom with scattered seagrass","Rock crevices and ledges","Boulder clusters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
69	Blackwall Reach	A freshwater–estuarine dive site along the Swan River featuring urban wreck diving with submerged cars, barges, and river debris. Home to diverse riverine species including bream, stripeys, moon and white-spotted jellyfish, gobbleguts, tube worms, and occasional crabs.	Swan River, Perth, Western Australia	Australia	-32.0212	115.783	Intermediate	3	15	3	12	15	25	Minimal	October - March	December	Urban River Site	Located in the Swan River system, this site requires careful environmental stewardship to protect the unique riverine ecosystem.	https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Urban Wreck Diving","Submerged Cars",Barges,"River Debris",Jellyfish,Bream,Stripeys,Gobbleguts,"Tube Worms"}	{Freshwater-Estuarine,"Urban Wreck","Silty Bottom","River Channel"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
96	Bulk Jetty	Industrial jetty dive in Cockburn Sound with schools of scalyfin, bullseyes, and herring. Octopuses, seahorses, and cuttlefish hide in pylons, with occasional Port Jackson sharks and stingrays. Nudibranchs and soft corals colonize the pylon structures.	Kwinana, Western Australia	Australia	-32.21	115.7673	Beginner	3	10	5	10	18	24	Mild	Ideal during low wind conditions and slack tide. Early mornings often provide the calmest water and best visibility.	\N	\N	\N	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Scalyfin Schools",Bullseyes,Herring,Octopuses,Seahorses,Cuttlefish,"Port Jackson Sharks",Stingrays,Nudibranchs,"Soft Corals"}	{"Artificial Reef","Jetty Pylons","Industrial Structure","Marine Growth"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
106	Rockingham Wreck Trail	Rockingham Dive Trail features six submerged wrecks including boats, planes, and artificial structures connected by guide ropes. This purpose-built dive site offers easy navigation for beginners while hosting diverse marine life on the encrusted wrecks.	Rockingham, Western Australia	Australia	-32.283333	115.7	Beginner	10	18	2	6	\N	\N	Mild	\N	\N	\N	Purpose-sunk wrecks create artificial reef habitat. Follow guide ropes to minimize environmental impact and avoid stirring sediment. The wrecks support diverse encrusting organisms and fish communities.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Six connected wrecks","Guide rope navigation","Purpose-built dive trail","Perfect for beginners","Diverse encrusting life"}	{"Artificial wrecks","Sandy bottom","Encrusted structures","Tyre reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
97	Camilla Wreck	Historic 190-ton schooner wreck from 1834, scuttled in 1903. Located 80m offshore in shallow 3.6m waters near ALCOA Jetty. Perfect for beginners and snorkelers with easy beach access from Challenger Beach.	Cockburn Sound, Kwinana	Australia	-32.1877	115.7742	Beginner	2	4	3	8	18	24	None	Year-round in calm weather	\N	\N	Protected under Maritime Legislation. Do not disturb or remove any artifacts from this historic wreck site.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400	{"Historic schooner wreck","Shallow depth perfect for snorkeling","Easy shore access","Paddle grass ecosystem"}	{Wreck,"Paddle Grass","Sandy Bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	camilla-wreck-maritime-history
99	Kwinana Grain Terminal	Kwinana Grain Terminal offers a dramatic dive site beneath towering grain terminal structures in the heart of the industrial port. The protected waters beneath the conveyor belt create ideal conditions for a surprisingly rich ecosystem. This unique dive combines industrial infrastructure with diverse marine life, featuring encrusted pylons teeming with filter feeders, soft corals, and schooling fish. The site serves as an unexpected oasis where divers can explore artificial reef formations while observing how marine life colonizes man-made structures.	Kwinana Beach, Western Australia	Australia	-32.2576	115.7507	Intermediate	2	20	10	20	\N	\N	Moderate	\N	\N	\N	Industrial marine environment supporting diverse ecosystems. Respect operational port activities and maintain safe distances from infrastructure. The jetty pylons have become important habitat for filter-feeding organisms and provide shelter for juvenile fish species.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Grain conveyor belt diving","Industrial marine ecosystem","Macro photography haven","Protected from weather","Unique dive experience"}	{"Jetty pylons","Sandy bottom","Artificial reef structures","Deep water channels"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
107	Rocky Bay	Rocky Bay offers a protected shore dive with diverse marine habitats including rocky reefs, seagrass beds, and sandy patches. This sheltered bay provides excellent conditions for beginners while offering enough variety to interest experienced divers.	Cockburn Sound, Western Australia	Australia	-32.327915	115.70881	Beginner	2	8	5	15	\N	\N	Minimal	\N	\N	\N	Popular recreational area requiring environmental awareness. The bay supports diverse habitats from rocky reef to seagrass meadows that provide nursery areas for juvenile fish.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Protected bay diving","Diverse habitats","Great for beginners","Seagrass meadows","Rocky reef formations"}	{"Rocky reef","Seagrass beds","Sandy patches","Sheltered bay"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
108	South Mole	South Mole in Fremantle provides an alternative dive site when conditions are unsuitable elsewhere. This protected breakwater location offers rocky reef diving with diverse marine life, though entry can be challenging.	Fremantle, Western Australia	Australia	-32.059166	115.740944	Intermediate	4	10	3	12	\N	\N	Mild to Moderate	\N	\N	\N	Located near Fremantle Harbour, divers should be aware of boat traffic and fishing activities. The breakwater creates important habitat for temperate marine species.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Protected from weather","Rocky reef diving","Breakwater structure","Alternative dive site","Diverse fish life"}	{"Rocky breakwater","Artificial structures","Kelp areas","Sandy patches"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
112	Wells Park Jetty	Wells Park Jetty provides sheltered diving along jetty pylons encrusted with marine growth. This accessible site offers good macro photography opportunities and is suitable for divers of all levels.	Scarborough, Western Australia	Australia	-32.311306	115.714775	Beginner	3	8	4	12	\N	\N	Minimal	\N	\N	\N	The jetty pylons create artificial reef habitat supporting diverse marine communities. Practice buoyancy control to avoid damaging the delicate growth on the structures.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Sheltered jetty diving","Macro photography","Encrusted pylons","All skill levels","Easy access"}	{"Jetty pylons","Artificial reef","Sandy areas","Encrusted structures"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
113	Yanchep Lagoon	Yanchep Lagoon offers unique lagoon diving within a protected marine environment. This northernmost Perth dive site features crystal clear waters, limestone reef systems, and diverse marine life in a stunning natural setting.	Yanchep, Western Australia	Australia	-31.553333	115.64	Beginner	1	5	10	25	\N	\N	Minimal	\N	\N	\N	Protected lagoon environment with fragile reef systems. The shallow clear waters support unique marine communities adapted to lagoon conditions. Avoid standing on coral and practice excellent buoyancy.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Crystal clear lagoon","Protected environment","Limestone reef","Perfect for snorkeling","Unique marine ecosystem"}	{"Lagoon environment","Limestone reef","Seagrass beds","Coral patches"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
93	Omeo Wreck	The Omeo Wreck offers Perth's most accessible historic shipwreck dive. This 1905 cargo steamer lies in shallow water just offshore, creating an artificial reef that has become home to diverse marine life. The scattered remains of the ship, including boilers, hull sections, and debris, provide structure for fish aggregations and invertebrate colonies. The shallow depth and proximity to shore make it perfect for wreck diving training, while the marine life and photogenic structure appeal to experienced divers.	Coogee, Perth, Western Australia	Australia	-32.27011	115.71489	Beginner	2	7	6	20	\N	\N	Minimal	\N	\N	\N	Protected heritage site - do not disturb or climb on the wreck. Part of the Coogee Maritime Trail managed by the City of Cockburn. The artificial reef structures provide important habitat for marine species.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Historic 1905 shipwreck","Shallow wreck dive","Marine life aggregations","Photography opportunities","Easy shore access"}	{"Shipwreck structure","Artificial reef","Sandy areas","Seagrass patches"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
104	Point Peron	Point Peron showcases spectacular underwater topography with its limestone reef system featuring caves, swim-throughs, and dramatic drop-offs. Located at the tip of the peninsula, this site offers multiple dive routes with varying conditions and marine life. The complex reef structure supports everything from tiny nudibranchs to large schools of fish, while the caves and overhangs provide shelter for rays and sharks. Known for excellent visibility and diverse diving options, Point Peron is a showcase of Perth's coastal marine environment.	Rockingham, Western Australia	Australia	-32.275417	115.692	Intermediate	2	15	8	20	\N	\N	Mild to Moderate	\N	\N	\N	Popular diving and snorkeling location requiring environmental awareness. Respect the natural reef formations and marine life. The limestone caverns and swim-throughs provide critical habitat for numerous species.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Spectacular reef topography","Caves and swim-throughs","Multiple dive routes","Excellent visibility","Diverse marine habitats"}	{"Limestone reef","Caverns and overhangs","Sandy patches","Kelp areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
105	Robbs Jetty	Robbs Jetty combines easy access with reliable marine life encounters in a historic jetty setting. The old timber pylons create a vertical reef environment supporting dense populations of fish and invertebrates. This sheltered site is particularly famous for its seahorse population and excellent macro photography opportunities. The jetty structure provides protection from weather, making it a dependable dive site year-round. Popular for night diving, the site transforms after dark with hunting cephalopods and nocturnal species.	Cockburn Sound, Western Australia	Australia	-32.10925	115.76022	Beginner	3	8	2	10	\N	\N	Mild	\N	\N	\N	While not in a protected area, divers should practice low-impact diving and watch for fishing lines. The jetty pylons provide important habitat for juvenile fish and macro species.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800	{"Historic jetty diving","Seahorse population","Macro photography heaven","Excellent night diving","Weather protected"}	{"Artificial reef pylons","Sandy bottom","Seagrass patches","Encrusted structures"}	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.events (id, user_id, name, type, start_date, end_date, location, city, dive_site_id, latitude, longitude, organizer_name, description, external_link, cost, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: lesson_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.lesson_progress (id, user_id, lesson_id, completed_at) FROM stdin;
\.


--
-- Data for Name: nearby_dive_sites; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.nearby_dive_sites (id, dive_site_id, nearby_dive_site_id, distance) FROM stdin;
1	1	3	4500
2	2	3	3200
3	7	9	4500
4	8	9	3200
5	54	56	4500
6	55	56	3200
7	61	63	4500
8	62	63	3200
\.


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.photos (id, user_id, dive_site_id, image_url, caption, date_uploaded, species_tags) FROM stdin;
\.


--
-- Data for Name: post_comments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.post_comments (id, post_id, user_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: post_likes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.post_likes (id, post_id, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.posts (id, user_id, content, photo_url, tags, location, dive_site_id, species_spotted, created_at, updated_at, linked_lesson_id) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.reviews (id, user_id, dive_site_id, rating, comment, date_posted) FROM stdin;
\.


--
-- Data for Name: species; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.species (id, common_name, scientific_name, description, image_url, conservation_status, category, habitats, fun_facts, domain, kingdom, phylum, class, "order", family, genus, region_found, tags, dive_site_areas, seasonal_occurrence, key_facts, mini_lesson_recommendations) FROM stdin;
1	Clownfish	Amphiprioninae	Small, brightly colored fish known for their symbiotic relationship with sea anemones.	https://images.unsplash.com/photo-1576806021995-9f68eb39f10b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	Green Sea Turtle	Chelonia mydas	Large sea turtle with a heart-shaped shell and small head. Named for the green fat beneath its shell.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Reptile	{"Coral Reef","Seagrass Beds","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	Reef Shark	Carcharhinus melanopterus	Medium-sized shark easily identified by the black tips on its fins. Common around coral reefs.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Coral Reef","Shallow Reef","Reef Drop-offs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	Manta Ray	Mobula birostris	One of the largest rays with a wingspan reaching up to 7 meters. Known for their intelligence and graceful swimming.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Ray	{"Open Ocean","Reef Drop-offs","Cleaning Stations"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	Harlequin Fish	Othos dentex	Often spotted near reef edges. Known for their distinctive patterned appearance.	https://images.unsplash.com/photo-1566551329999-ece81cad59fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Reef Edges","Rocky Reef","Open Water"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	Dhufish	Glaucosoma hebraicum	Inhabits deeper sections of reefs and is naturally wary of divers. Prized by recreational fishers.	https://images.unsplash.com/photo-1574781330855-d0db3eb7e905?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Fish	{"Deep Reef","Rocky Reef","Continental Shelf"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	Buffalo Bream	Kyphosus cornelii	Seen grazing in groups across reef systems. Known for their schooling behavior.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef","Seagrass Beds","Open Water"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
13	Scalyfin	Parma occidentalis	Defends its territory aggressively. Small but feisty fish common on Western Australian reefs.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef","Territorial Areas","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
14	Moon Wrasse	Thalassoma lunare	Adds vibrant color to the reefscape with its brilliant blue and green patterns.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Tropical Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
10	Wobbegong Shark	Orectolobus spp.	Lies motionless during the day and becomes active at night. Master of camouflage on reef floors.	https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Rocky Reef","Sandy Bottom",Caves}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
11	Port Jackson Shark	Heterodontus portusjacksoni	Commonly encountered resting in sandy areas during the day. Has distinctive harness-like markings.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Sandy Bottom","Rocky Reef","Temperate Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	Blue Groper	Achoerodus gouldii	Large blue fish commonly seen patrolling Western Australian reefs. Males develop a distinctive bright blue coloration.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef","Limestone Reef","Temperate Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	Western Blue Devil	Paraplesiops meleagris	Prefers caves and overhangs of reef systems. Has distinctive blue coloration with spotted patterns.	https://images.unsplash.com/photo-1566551329999-ece81cad59fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef",Caves,Overhangs}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
12	Western Rock Lobster	Panulirus cygnus	Found in abundance within reef crevices. Commercially important species in Western Australia.	https://images.unsplash.com/photo-1559715541-5daf8a0296fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Rocky Reef",Crevices,"Limestone Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
30	Common Stingray	Dasyatis pastinaca	Flat-bodied ray species often found buried in sandy areas, identifiable by its diamond-shaped body and venomous tail spine.	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&crop=entropy&auto=format	Least Concern	Fish	{"Sandy bottoms","Coastal waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
31	Great Barracuda	Sphyraena barracuda	Large predatory fish with elongated body and sharp teeth, often seen patrolling reef edges in small groups.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=entropy&auto=format	Least Concern	Fish	{"Rocky reefs","Open water"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
32	French Angelfish	Pomacanthus paru	Distinctive black fish with bright yellow stripes, commonly found around rocky reefs and cave entrances.	https://images.unsplash.com/photo-1555169062-013468b47731?w=800&h=600&fit=crop&crop=entropy&auto=format	Least Concern	Fish	{"Rocky reefs","Cave systems"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
33	Mediterranean Moray Eel	Muraena helena	Large eel species that inhabits rocky crevices and caves, recognized by its mottled brown and yellow coloration.	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&crop=entropy&auto=format	Least Concern	Fish	{"Rocky reefs","Cave systems"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
34	Garden Eel	Heteroconger hassi	Small eel species that lives in colonies in sandy areas, protruding from burrows to feed on plankton.	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=entropy&auto=format	Least Concern	Fish	{"Sandy bottoms"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
35	Atlantic Trumpetfish	Aulostomus maculatus	Elongated fish with tube-like snout, often seen hovering vertically among corals and rocks.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&crop=entropy&auto=format	Least Concern	Fish	{"Rocky reefs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
36	Red Mullet	Mullus barbatus	Small bottom-dwelling fish with distinctive barbels, commonly found foraging in sandy areas.	https://images.unsplash.com/photo-1555169062-013468b47731?w=800&h=600&fit=crop&crop=entropy&auto=format	Least Concern	Fish	{"Sandy bottoms","Rocky reefs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
37	Angel Shark	Squatina squatina	Critically endangered flat shark species that buries itself in sand, seasonally seen in Canary Islands waters.	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&crop=entropy&auto=format	Critically Endangered	Fish	{"Sandy bottoms"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
38	Spiny Butterfly Ray	Gymnura altavela	Large ray species with diamond-shaped body and distinctive spotted pattern, seasonally found in deeper sandy areas.	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&crop=entropy&auto=format	Vulnerable	Fish	{"Sandy bottoms","Coastal waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
40	Bumphead Parrotfish	Bolbometopon muricatum	Massive parrotfish that can grow over 1 meter, important for reef health	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop	Vulnerable	Fish	{"Coral reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
41	Giant Trevally	Caranx ignobilis	Large predatory jack fish known for aggressive hunting behavior	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop	Least Concern	Fish	{"Coral reef","Open water"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
42	Napoleon Wrasse	Cheilinus undulatus	Massive wrasse that can live over 30 years, iconic species of Indo-Pacific reefs	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop	Endangered	Fish	{"Coral reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
43	Lionfish	Pterois volitans	Venomous fish with elaborate fins, often found around wrecks	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop	Least Concern	Fish	{"Coral reef",Shipwreck}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
44	Stonefish	Synanceia verrucosa	Highly venomous bottom-dwelling fish, masters of camouflage	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop	Least Concern	Fish	{"Coral reef","Rocky bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
45	Batfish	Platax pinnatus	Disc-shaped fish often seen in schools around structures	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop	Least Concern	Fish	{"Coral reef",Shipwreck}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
46	Harlequin Shrimp	Hymenocera picta	Colorful small shrimp that feeds exclusively on sea stars	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop	Least Concern	Crustacean	{"Coral reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
47	Seahorse	Hippocampus spp.	Unique fish with horse-like head and prehensile tail	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop	Vulnerable	Fish	{"Coral reef",Seagrass}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
48	Ragged-tooth Shark	Carcharias taurus	Large shark with protruding teeth, forms aggregations during winter	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop	Vulnerable	Shark	{"Rocky bottom",Cave}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
49	Scalloped Hammerhead	Sphyrna lewini	Distinctive shark known for massive schooling behavior	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop	Critically Endangered	Shark	{"Open water","Rocky island"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	Ghost Pipefish	Solenostomus cyanopterus	Delicate fish that mimics floating debris, excellent camouflage	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop	Least Concern	Fish	{"Coral reef",Shipwreck}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	Grey Reef Shark	Carcharhinus amblyrhynchos	Aggressive reef shark commonly found in tropical waters	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop	Near Threatened	Shark	{"Coral reef","Open water"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	Eagle Ray	Aetobatus narinari	Large ray with distinctive spotted pattern and long whip-like tail	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop	Near Threatened	Ray	{"Sandy bottom","Coral reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	Bull Shark	Carcharhinus leucas	Aggressive shark that can tolerate both saltwater and freshwater	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop	Near Threatened	Shark	{"Open water",Coastal}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	Tiger Shark	Galeocerdo cuvier	Large predatory shark with distinctive stripes, apex predator	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop	Near Threatened	Shark	{"Open water",Coastal}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	Moray Eel	Gymnothorax javanicus	Large eel species that hides in crevices and holes	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop	Least Concern	Fish	{"Coral reef",Shipwreck}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	Lemon Shark	Negaprion brevirostris	Medium-sized shark with distinctive yellow coloration, often found in shallow waters	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop	Near Threatened	Shark	{"Shallow reef","Sandy bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	Nurse Shark	Ginglymostoma cirratum	Docile bottom-dwelling shark with distinctive barbels	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop	Vulnerable	Shark	{"Coral reef","Sandy bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	Mantis Shrimp	Odontodactylus scyllarus	Colorful crustacean with powerful striking appendages and complex eyes	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop	Least Concern	Crustacean	{"Muck bottom",Burrows}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
60	Goby	Gobiidae family	Small bottom-dwelling fish known for symbiotic relationships	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop	Least Concern	Fish	{"Sandy bottom","Coral reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
61	Octopus	Octopus vulgaris	Intelligent cephalopod with exceptional camouflage abilities	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop	Least Concern	Cephalopod	{"Rocky bottom","Coral reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
62	Grouper	Epinephelus spp.	Large predatory fish important for reef ecosystem balance	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop	Vulnerable	Fish	{"Coral reef","Rocky bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
63	Parrotfish	Scaridae family	Colorful reef fish that graze on algae and help maintain coral health	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop	Least Concern	Fish	{"Coral reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
64	Angelfish	Pomacanthidae family	Brightly colored reef fish with distinctive body shape	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop	Least Concern	Fish	{"Coral reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
65	Grey Shark	Carcharhinus plumbeus	Medium-sized reef shark common in tropical waters	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop	Vulnerable	Shark	{"Open water","Coral reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
66	Dolphin	Tursiops truncatus	Intelligent marine mammal known for playful behavior	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop	Least Concern	Mammal	{"Open water"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
67	White-tip Shark	Triaenodon obesus	Small reef shark with distinctive white-tipped fins	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop	Near Threatened	Shark	{"Coral reef",Cave}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
68	Trevally	Carangidae family	Fast-swimming predatory fish often found in schools	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop	Least Concern	Fish	{"Open water","Coral reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
69	Sweetlips	Haemulidae family	Colorful reef fish with distinctive thick lips	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop	Least Concern	Fish	{"Coral reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
70	Snapper	Lutjanidae family	Important reef predator with excellent eating quality	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop	Least Concern	Fish	{"Coral reef","Rocky bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
71	Yellowtail Snapper	Ocyurus chrysurus	Medium-sized fish with bright yellow tail and silver body. Forms large schools around reefs and wrecks.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Wreck Sites"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
72	Royal Angelfish	Pygoplites diacanthus	Stunning angelfish with orange and blue vertical stripes. Territorial and often found near coral formations.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef",Lagoons,"Reef Slopes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
73	Mandarin Fish	Synchiropus splendidus	Small, colorful fish with psychedelic patterns. Most active during dusk and dawn feeding periods.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef",Lagoons,"Protected Bays"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
74	Moorish Idol	Zanclus cornutus	Distinctive black and white striped fish with long dorsal fin. Often confused with butterflyfish.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef",Lagoons}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
75	Powder Blue Tang	Paracanthurus hepatus	Bright blue fish with black patterns and yellow tail. Important herbivore in reef ecosystems.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Seagrass Beds",Lagoons}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
76	Butterflyfish	Chaetodon auriga	Yellow butterflyfish with distinctive eye spot and black markings. Feeds primarily on coral polyps.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
77	Damselfish	Pomacentrus coelestis	Small, territorial blue fish that aggressively defends its territory. Forms large colonies on reefs.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Shallow Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
78	Surgeonfish	Acanthurus leucosternon	Blue and white fish with sharp spines near the tail. Important algae grazer in reef ecosystems.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Reef Slopes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
79	Wrasse	Labroides dimidiatus	Cleaner wrasse that removes parasites from other fish. Essential for reef health and fish hygiene.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Cleaning Stations","Rocky Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
80	Filefish	Oxymonacanthus longirostris	Elongated fish with distinctive orange and blue patterns. Feeds on coral polyps and small invertebrates.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Seagrass Beds","Protected Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
81	Boxfish	Ostracion cubicus	Yellow cube-shaped fish with black spots. Unique body shape provides protection from predators.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Sandy Areas",Lagoons}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
82	Triggerfish	Balistoides conspicillum	Large, aggressive fish with powerful jaws. Can rearrange coral rubble to find food.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Reef Slopes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
83	Pufferfish	Arothron nigropunctatus	Round fish that inflates when threatened. Contains toxins that make it poisonous to predators.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Seagrass Beds","Sandy Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
84	Cardinalfish	Pterapogon kauderni	Small fish with distinctive black and white stripes. Males carry eggs in their mouths until hatching.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Fish	{"Coral Reef","Seagrass Beds","Protected Bays"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
85	Chromis	Chromis viridis	Small, bright green fish that forms large aggregations above coral formations. Important in reef food webs.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef",Lagoons,"Shallow Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
86	Hawkfish	Oxycirrhites typus	Red and white checkered fish that perches on coral formations. Ambush predator with excellent eyesight.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Gorgonian Fans"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
87	Blenny	Meiacanthus grammistes	Small, elongated fish with venomous bite. Mimicked by other harmless species for protection.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rock Crevices","Rubble Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
88	Rabbitfish	Siganus vulpinus	Yellow fish with black markings and venomous spines. Important herbivore that controls algae growth.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Seagrass Beds",Lagoons}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
89	Basslet	Gramma loreto	Small purple and yellow fish that lives in caves and overhangs. Territorial and solitary in nature.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef",Caves,"Rock Overhangs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
90	Frogfish	Antennarius striatus	Master of camouflage with ability to change color and texture. Ambush predator with expandable mouth.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Sponge Gardens","Rocky Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
91	Bamboo Shark	Chiloscyllium punctatum	Small, docile shark with distinctive spotted pattern. Often rests on sandy bottoms during the day.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Sandy Bottom","Coral Reef","Shallow Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
92	Blacktip Reef Shark	Carcharhinus melanopterus	Small reef shark with distinctive black-tipped fins. Often seen in shallow lagoons and reef flats.	https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Shark	{"Coral Reef",Lagoons,"Shallow Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
93	Leopard Shark	Triakis semifasciata	Spotted shark that prefers sandy and muddy bottoms. Harmless to humans and often encountered by divers.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Sandy Bottom","Muddy Areas","Kelp Forests"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
95	Blue Spotted Ray	Taeniura lymma	Small stingray with distinctive blue spots. Has venomous barb but generally docile unless threatened.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Ray	{"Sandy Bottom","Coral Reef","Shallow Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
96	Electric Ray	Torpedo torpedo	Round ray capable of generating electric shocks. Uses electrical discharge for defense and prey capture.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Ray	{"Sandy Bottom","Muddy Areas","Coastal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
97	Spotted Eagle Ray	Aetobatus narinari	Large ray with distinctive spotted pattern and long tail. Often seen gliding over sandy areas.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Ray	{"Sandy Bottom","Open Ocean","Reef Drop-offs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
98	Devil Ray	Mobula mobular	Smaller relative of manta rays known for spectacular jumping behavior. Forms large aggregations.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Ray	{"Open Ocean","Continental Shelf","Deep Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
99	Humpback Whale	Megaptera novaeangliae	Large baleen whale known for complex songs and spectacular breaching behavior. Migrates vast distances.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mammal	{"Open Ocean","Continental Shelf","Migration Routes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
100	Pilot Whale	Globicephala melas	Large toothed whale with distinctive bulbous head. Lives in family groups called pods.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mammal	{"Deep Ocean","Continental Slope","Open Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
101	Dugong	Dugong dugon	Large marine mammal that grazes on seagrass. Related to manatees and found in warm coastal waters.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Mammal	{"Seagrass Beds","Shallow Bays","Coastal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
102	Spinner Dolphin	Stenella longirostris	Acrobatic dolphin known for spinning leaps out of water. Forms large pods in tropical waters.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mammal	{"Open Ocean","Deep Waters","Tropical Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
103	Seal	Arctocephalus pusillus	Playful marine mammal with excellent underwater agility. Forms large colonies on rocky shores.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mammal	{"Rocky Shores","Kelp Forests","Coastal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
104	Hermit Crab	Dardanus pedunculatus	Crab that lives in empty shells and moves to larger shells as it grows. Often has symbiotic anemones.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Sandy Bottom","Coral Reef","Rocky Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
105	Decorator Crab	Camposcia retusa	Crab that camouflages itself by attaching sponges, algae, and other organisms to its shell.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Coral Reef","Sponge Gardens","Rocky Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
106	Cleaner Shrimp	Lysmata amboinensis	Red and white striped shrimp that removes parasites from fish. Sets up cleaning stations on reefs.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Coral Reef","Cleaning Stations","Rock Crevices"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
107	Slipper Lobster	Scyllarides squammosus	Flattened lobster with shovel-like antennae. Burrows in sand and emerges to feed at night.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Sandy Bottom",Burrows,"Coastal Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
108	Banded Coral Shrimp	Stenopus hispidus	Large shrimp with long white antennae and red and white banded body. Territorial cleaning species.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Coral Reef","Rock Crevices","Cleaning Stations"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
109	Sally Lightfoot Crab	Grapsus grapsus	Colorful crab with red and orange markings. Extremely agile and able to run across water surface.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Rocky Shores","Tide Pools","Coastal Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
110	Pistol Shrimp	Alpheus bellulus	Small shrimp with one enlarged claw that creates cavitation bubbles. Often forms symbiotic relationships with gobies.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Sandy Bottom",Burrows,"Coral Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
111	Giant Clam	Tridacna gigas	Largest bivalve mollusk with colorful mantle tissue. Forms symbiotic relationship with zooxanthellae algae.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Mollusk	{"Coral Reef",Lagoons,"Sandy Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
112	Cuttlefish	Sepia officinalis	Intelligent cephalopod with ability to rapidly change color and texture. Uses jet propulsion for movement.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Seagrass Beds","Sandy Areas","Rocky Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
113	Cone Shell	Conus textile	Venomous predatory snail with beautiful patterned shell. Hunts other mollusks and worms with harpoon-like radula.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Sandy Bottom","Coral Reef","Rubble Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
114	Flamingo Tongue	Cyphoma gibbosum	Small snail with distinctive orange-spotted mantle. Feeds exclusively on soft corals and sea fans.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Coral Reef","Gorgonian Fans","Soft Coral Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
115	Blue-ringed Octopus	Hapalochlaena lunulata	Small but highly venomous octopus with blue ring warning coloration. Extremely dangerous despite small size.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Tide Pools","Rocky Areas","Coral Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
116	Crown of Thorns Starfish	Acanthaster planci	Large starfish with venomous spines that feeds on coral polyps. Can cause significant reef damage in outbreaks.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Echinoderm	{"Coral Reef","Rocky Reef","Reef Slopes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
117	Sea Cucumber	Holothuria atra	Black sea cucumber that processes sediment and plays important role in nutrient cycling on reefs.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Echinoderm	{"Sandy Bottom","Seagrass Beds","Coral Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
118	Brittle Star	Ophiothrix fragilis	Five-armed echinoderm with flexible arms that break off easily when threatened. Important detritus feeder.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Echinoderm	{"Rocky Areas","Coral Reef","Rubble Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
119	Feather Star	Antedon bifida	Crinoid with feathery arms used for filter feeding. Can swim by coordinated arm movements.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Echinoderm	{"Rocky Areas","Coral Reef","Current-swept Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
120	Pencil Urchin	Eucidaris tribuloides	Sea urchin with thick, blunt spines that grazes on algae. Important herbivore in maintaining reef balance.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Echinoderm	{"Coral Reef","Rocky Areas","Seagrass Beds"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
121	Unicornfish	Naso lituratus	Large herbivorous fish with horn-like projection on forehead. Important grazer that controls algae growth on reefs.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Reef Slopes","Open Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
122	Bannerfish	Heniochus acuminatus	Black and white striped fish with elongated dorsal fin. Often forms large schools in open water.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Open Waters","Reef Drop-offs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
123	Anthias	Pseudanthias squamipinnis	Colorful reef fish that forms large aggregations. Dominant males are larger and more colorful than females.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Current Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
124	Goatfish	Parupeneus multifasciatus	Bottom-dwelling fish with barbels used to detect prey in sand. Changes color when feeding or resting.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sandy Bottom","Seagrass Beds","Coral Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
125	Squirrelfish	Holocentrus adscensionis	Red nocturnal fish with large eyes adapted for night vision. Hides in caves during the day.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef",Caves,"Rocky Crevices"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
126	Soldierfish	Myripristis murdjan	Similar to squirrelfish but with different fin structure. Forms schools in caves and overhangs during day.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef",Caves,Overhangs}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
127	Sweetlips	Plectorhinchus chaetodonoides	Large-lipped fish that changes dramatically from juvenile to adult coloration. Slow-moving bottom feeder.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Sandy Areas","Rocky Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
128	Emperorfish	Lethrinus harak	Large predatory fish with powerful jaws for crushing shells. Important apex predator on reefs.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Sandy Areas","Seagrass Beds"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
129	Dottyback	Pseudochromis fridmani	Small, territorial fish with vibrant colors. Defends small territories aggressively against intruders.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rock Crevices","Small Territories"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
130	Fairy Wrasse	Cirrhilabrus exquisitus	Colorful wrasse with elaborate fins and courtship displays. Males are more colorful than females.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Reef Slopes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
131	Cornetfish	Fistularia commersonii	Elongated fish with tube-like snout for catching small prey. Often follows other fish to catch startled prey.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Seagrass Beds","Open Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
132	Shrimpfish	Aeoliscus strigatus	Thin, vertical fish that mimics sea urchin spines. Swims head-down among urchin spines for protection.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Sea Urchin Areas","Protected Bays"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
133	Dragonet	Synchiropus picturatus	Small, colorful bottom-dwelling fish with elaborate fin displays. Males have extended dorsal fins.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sandy Bottom","Rubble Areas","Coral Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
134	Needlefish	Tylosurus crocodilus	Long, thin fish with needle-like jaws. Surface swimmer that feeds on small fish near the surface.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Surface Waters","Open Ocean",Lagoons}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
135	Lizardfish	Synodus variegatus	Bottom-dwelling predator that buries itself in sand. Ambushes prey with lightning-fast strikes.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sandy Bottom","Coral Reef","Ambush Sites"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
136	Fusilier	Caesio caerulaurea	Fast-swimming schooling fish with blue and yellow coloration. Forms large feeding aggregations.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Waters","Reef Drop-offs","Current Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
137	Barracuda	Sphyraena qenie	Predatory fish with sharp teeth and torpedo-shaped body. Often forms large schools in open water.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Waters","Reef Drop-offs","Schooling Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
138	Jack	Caranx melampygus	Fast-swimming predator with metallic coloration. Forms hunting schools that patrol reef edges.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Waters","Reef Edges","Schooling Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
139	Remora	Echeneis naucrates	Fish with sucker disc on head used to attach to larger marine animals. Feeds on scraps and parasites.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Attached to Hosts","Cleaning Stations"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
140	Flathead	Platycephalus fuscus	Bottom-dwelling predator with flattened head and excellent camouflage. Ambushes prey from sandy burrows.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sandy Bottom","Muddy Areas",Estuaries}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
141	Pipefish	Corythoichthys haematopterus	Elongated fish related to seahorses with tube-like snout. Males carry eggs until hatching.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Seagrass Beds","Coral Gardens","Protected Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
142	Stargazer	Uranoscopus sulphureus	Bottom-dwelling fish with eyes on top of head. Buries itself in sand with only eyes exposed.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sandy Bottom","Muddy Areas","Buried Positions"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
143	Dartfish	Nemateleotris magnifica	Small fish that hovers above burrows with distinctive elongated dorsal fin. Darts into burrow when threatened.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sandy Slopes",Burrows,"Deep Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
144	Leatherjacket	Stephanolepis hispidus	Small fish with rough skin and ability to lock dorsal spine. Feeds on small invertebrates and algae.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Seagrass Beds","Rocky Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
145	Trumpetfish	Aulostomus chinensis	Long, thin fish that can change color to match surroundings. Often follows other fish to ambush prey.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Seagrass Beds","Following Schools"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
146	Hammerhead Shark	Sphyrna zygaena	Distinctive shark with flattened head extensions. Uses electroreception to locate prey buried in sand.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Shark	{"Open Ocean","Continental Shelf","Deep Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
147	Thresher Shark	Alopias vulpinus	Large shark with extremely long tail fin used to stun schooling fish. Excellent jumping ability.	https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Shark	{"Open Ocean","Continental Shelf","Deep Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
148	Sand Tiger Shark	Carcharias taurus	Large shark with protruding teeth and ability to gulp air for buoyancy control. Generally docile.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Shark	{"Sandy Bottom","Rocky Reefs",Caves}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
149	Silky Shark	Carcharhinus falciformis	Sleek pelagic shark with smooth skin texture. Often follows schools of tuna and other large fish.	https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Shark	{"Open Ocean","Pelagic Waters","Deep Sea"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
150	Marble Ray	Taeniurops meyeni	Large stingray with distinctive marbled pattern. Can grow to enormous size with wingspan over 5 meters.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Ray	{"Sandy Bottom","Coral Reef","Deep Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
151	Cownose Ray	Rhinoptera bonasus	Diamond-shaped ray with distinctive indented head. Forms large migratory schools in open water.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Ray	{"Open Waters","Sandy Flats","Migration Routes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
152	Torpedo Ray	Torpedo nobiliana	Large electric ray capable of generating powerful shocks. Uses electricity for defense and prey capture.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Ray	{"Sandy Bottom","Continental Shelf","Deep Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
153	Guitarfish	Rhinobatos rhinobatos	Flattened ray with shark-like tail. Prefers sandy bottoms where it buries itself during the day.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Ray	{"Sandy Bottom","Coastal Waters","Shallow Bays"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
154	Hawksbill Turtle	Eretmochelys imbricata	Sea turtle with distinctive hooked beak specialized for eating sponges. Critically endangered due to hunting.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Reptile	{"Coral Reef","Rocky Areas","Sponge Gardens"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
155	Loggerhead Turtle	Caretta caretta	Large sea turtle with powerful jaws for crushing shells. Makes epic migrations across ocean basins.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Reptile	{"Open Ocean","Nesting Beaches","Migration Routes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
156	Leatherback Turtle	Dermochelys coriacea	Largest sea turtle with leathery shell instead of hard scutes. Deep diver that feeds primarily on jellyfish.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Reptile	{"Open Ocean","Deep Waters","Jellyfish Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
157	Olive Ridley Turtle	Lepidochelys olivacea	Small sea turtle known for synchronized mass nesting events called arribadas. Feeds on crustaceans.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Reptile	{"Open Ocean","Nesting Beaches","Coastal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
158	Sea Snake	Hydrophis platurus	Highly venomous marine snake adapted for life at sea. Cannot move on land and gives birth in water.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Reptile	{"Open Ocean","Surface Waters","Warm Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
159	Staghorn Coral	Acropora cervicornis	Fast-growing branching coral that forms dense thickets. Important reef builder but vulnerable to bleaching.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Coral	{"Shallow Reef","Coral Gardens","Protected Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
160	Brain Coral	Diploria labyrinthiformis	Large dome-shaped coral with maze-like ridges. Long-lived species that can form massive colonies.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Coral	{"Coral Reef","Rocky Areas","Stable Substrates"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
161	Table Coral	Acropora hyacinthus	Flat, plate-like coral that maximizes surface area for light capture. Forms extensive table formations.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Coral	{"Shallow Waters","High Light Areas","Coral Gardens"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
162	Sea Anemone	Heteractis magnifica	Large anemone with powerful stinging tentacles. Forms symbiotic relationships with clownfish.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Coral Reef","Rocky Areas","Protected Spots"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
164	Fire Coral	Millepora alcicornis	Colonial hydroid that forms coral-like structures. Powerful sting can cause painful burns.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Shallow Reef","High Energy Areas","Reef Edges"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
165	Jellyfish	Aurelia aurita	Common moon jellyfish with translucent bell and short tentacles. Forms large blooms in favorable conditions.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Open Waters",Bays,"Coastal Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
166	Christmas Tree Worm	Spirobranchus giganteus	Tube worm with feathery feeding appendages that retract instantly when disturbed. Lives embedded in coral.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Coral Reef","Hard Coral Heads","Rocky Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
167	Giant Tube Sponge	Aplysina lacunosa	Large barrel-shaped sponge that filters vast amounts of water. Important for water quality on reefs.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Sponge	{"Coral Reef","Rocky Walls","Current Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
168	Angelfish	Centropyge bicolor	Small angelfish with distinctive blue and yellow coloration. Territorial and feeds on algae and small invertebrates.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rock Formations","Territorial Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
169	Moray Eel	Gymnothorax meleagris	Large predatory eel with powerful jaws and excellent sense of smell. Hunts primarily at night.	https://images.squarespace-cdn.com/content/v1/5e2e3c8c8c5c5a4e4f0b8c5a/1580299999999-1580299999999/moray+eel.jpg	Least Concern	Fish	{"Rocky Crevices","Coral Reef",Caves}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
170	Clown Triggerfish	Balistoides conspicillum	Large triggerfish with distinctive spotted pattern and powerful jaws. Can rearrange reef structure when feeding.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Areas","Reef Slopes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
171	Regal Tang	Paracanthurus hepatus	Bright blue tang with black pattern resembling a painters palette. Important herbivore in reef ecosystems.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Algae Gardens","Open Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
172	Yellow Tang	Zebrasoma flavescens	Bright yellow herbivorous fish that grazes on algae. Forms large schools in some locations.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Algae Areas","Rocky Slopes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
173	Longnose Hawkfish	Oxycirrhites typus	Distinctive red and white checkered fish with elongated snout. Perches motionless on coral formations.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Formations","Gorgonian Fans","Rocky Perches"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
174	Six-line Wrasse	Pseudocheilinus hexataenia	Small, colorful wrasse with six horizontal lines. Excellent cleaner fish that removes parasites.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Cleaning Stations","Rock Crevices"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
175	Flame Angelfish	Centropyge loricula	Vibrant orange-red angelfish with blue edges. Popular in aquarium trade but wild populations stable.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rock Formations","Cave Entrances"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
176	Green Chromis	Chromis viridis	Small green fish that forms large aggregations above coral. Important link in reef food webs.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Gardens","Reef Tops","Aggregation Sites"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
177	Blue-green Chromis	Chromis cyanea	Iridescent blue-green fish that schools above reef formations. Feeds on zooplankton in water column.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Open Water","Plankton Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
178	Coral Beauty	Centropyge bispinosa	Purple and orange angelfish with distinctive coloration. Semi-aggressive and feeds on algae and coral polyps.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Algae Areas","Rock Formations"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
179	Copperband Butterflyfish	Chelmon rostratus	Distinctive butterflyfish with copper bands and elongated snout. Feeds on tube worms and small invertebrates.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Tube Worm Areas","Rocky Crevices"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
180	Raccoon Butterflyfish	Chaetodon lunula	Yellow butterflyfish with black mask around eyes. Feeds primarily on coral polyps and tube worms.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Polyp Gardens","Protected Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
181	Foxface Rabbitfish	Siganus vulpinus	Yellow fish with distinctive black and white facial pattern. Venomous spines provide protection from predators.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Algae Gardens","Seagrass Beds"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
182	Spotted Drum	Equetus punctatus	Distinctive black and white striped fish with elongated fins. Juveniles have different coloration than adults.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Cave Openings",Overhangs}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
183	High-hat	Equetus acuminatus	Unusual fish with extremely elongated dorsal fin. Related to drums and croakers.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sandy Areas","Coral Reef","Protected Coves"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
184	Beau Gregory	Stegastes leucostictus	Territorial damselfish that aggressively defends algae gardens. Important in maintaining reef diversity.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Algae Gardens","Territorial Areas","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
185	Sergeant Major	Abudefduf saxatilis	Black and white striped damselfish that forms large schools. Males guard nests aggressively during breeding.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Schooling Areas","Nesting Sites"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
186	Rock Beauty	Holacanthus tricolor	Striking angelfish with yellow front and black rear. Feeds primarily on sponges and tunicates.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sponge Gardens","Rocky Areas","Coral Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
187	Stoplight Parrotfish	Sparisoma viride	Large parrotfish that changes color dramatically from juvenile to adult. Important sand producer on reefs.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Seagrass Beds","Coral Reef","Sandy Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
188	Bonnethead Shark	Sphyrna tiburo	Smallest hammerhead shark with shovel-shaped head. Feeds primarily on crustaceans and small fish.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Shallow Bays","Seagrass Beds","Sandy Flats"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
189	Spinner Shark	Carcharhinus brevipinna	Fast-swimming shark known for spectacular spinning leaps when feeding. Forms large schools during migration.	https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Open Waters","Continental Shelf","Migration Routes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
190	Dusky Shark	Carcharhinus obscurus	Large migratory shark with slow growth rate. Important apex predator in marine ecosystems.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Shark	{"Continental Shelf","Open Ocean","Deep Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
191	Round Stingray	Urobatis halleri	Small round stingray common in shallow waters. Often buried in sand in tide pools and shallow bays.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Ray	{"Sandy Shallows","Tide Pools","Eelgrass Beds"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
192	Manta Ray	Mobula alfredi	Reef manta ray smaller than oceanic manta. Regular visitor to cleaning stations and feeding areas.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Ray	{"Cleaning Stations","Reef Areas","Plankton Rich Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
193	Sperm Whale	Physeter macrocephalus	Largest toothed whale with massive square head. Deep diver that feeds primarily on giant squid.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Mammal	{"Deep Ocean","Continental Slope","Abyssal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
194	Blue Whale	Balaenoptera musculus	Largest animal on Earth feeding exclusively on tiny krill. Can reach lengths over 30 meters.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Mammal	{"Open Ocean","Krill Rich Waters","Migration Routes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
195	Orca	Orcinus orca	Largest dolphin species with distinctive black and white coloration. Highly intelligent apex predator.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Data Deficient	Mammal	{"Open Ocean","Coastal Waters","All Marine Environments"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
196	Beluga Whale	Delphinapterus leucas	White whale with distinctive rounded head and no dorsal fin. Highly vocal with complex communication.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Mammal	{"Arctic Waters","Cold Seas",Estuaries}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
197	Manatee	Trichechus manatus	Large herbivorous marine mammal that grazes on seagrass. Gentle giant threatened by boat strikes.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Mammal	{"Seagrass Beds","Warm Springs","Coastal Rivers"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
198	Spider Crab	Libinia emarginata	Long-legged crab that decorates itself with sponges and algae for camouflage. Slow-moving scavenger.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Rocky Areas","Kelp Forests","Deep Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
199	Ghost Crab	Ocypode quadrata	Fast-running crab that lives in burrows on sandy beaches. Most active at night and during low tide.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Sandy Beaches",Dunes,"Intertidal Zone"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
200	Blue Crab	Callinectes sapidus	Swimming crab with bright blue claws and olive-colored shell. Important commercial and ecological species.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{Estuaries,"Salt Marshes","Seagrass Beds"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
201	Fiddler Crab	Uca pugnax	Small crab where males have one enormously enlarged claw used for territorial displays and courtship.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Salt Marshes",Mudflats,Mangroves}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
202	Horseshoe Crab	Limulus polyphemus	Ancient arthropod more related to spiders than crabs. Blue blood used in medical testing for bacterial contamination.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Crustacean	{"Sandy Beaches","Shallow Bays","Spawning Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
203	Coconut Crab	Birgus latro	Largest land arthropod that can crack coconuts with powerful claws. Returns to ocean only to release eggs.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Data Deficient	Crustacean	{"Tropical Islands","Coastal Areas","Palm Forests"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
204	Barnacle	Balanus glandula	Filter-feeding crustacean that attaches permanently to hard surfaces. Important food source for many marine animals.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Rocky Shores",Pilings,"Ship Hulls"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
205	Krill	Euphausia superba	Small shrimp-like crustacean that forms massive swarms. Foundation species supporting many marine food webs.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Open Ocean","Polar Waters","Upwelling Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
206	Chambered Nautilus	Nautilus pompilius	Ancient cephalopod with external shell divided into chambers. Living fossil with simple eyes and many tentacles.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Cephalopod	{"Deep Reef Slopes","Coral Walls","Deep Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
207	Squid	Loligo pealei	Fast-swimming cephalopod with ten arms and ability to change color rapidly. Important prey species for many predators.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Open Waters","Continental Shelf","Schooling Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
208	Scallop	Pecten maximus	Bivalve mollusk capable of swimming by clapping shells together. Has numerous eyes along shell margin.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Sandy Bottom","Seagrass Beds","Shell Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
209	Abalone	Haliotis rufescens	Large gastropod with iridescent shell interior. Grazes on algae and has been overharvested in many areas.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Mollusk	{"Rocky Shores","Kelp Forests","Algae Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
210	Conch	Strombus gigas	Large gastropod with distinctive spiral shell. Important herbivore and culturally significant seafood species.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Mollusk	{"Seagrass Beds","Sandy Areas","Warm Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
211	Chiton	Chiton tuberculatus	Oval mollusk with eight overlapping shell plates. Grazes on algae from rocks using radula tongue.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Rocky Intertidal","Tide Pools","Wave-swept Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
212	Sea Slug	Elysia chlorotica	Unusual slug that incorporates chloroplasts from algae and can photosynthesize like a plant.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Salt Marshes","Algae Beds","Shallow Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
213	Sunflower Star	Pycnopodia helianthoides	Largest sea star with up to 24 arms and fastest movement of any starfish. Keystone predator in kelp forests.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Echinoderm	{"Kelp Forests","Rocky Shores","Cold Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
214	Sand Dollar	Echinarachnius parma	Flattened sea urchin that burrows in sand. Feeds on organic particles and small organisms in sediment.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Echinoderm	{"Sandy Bottom","Shallow Bays","Intertidal Zone"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
215	Sea Lily	Antedon mediterranea	Ancient echinoderm with feathery arms for filter feeding. Attached to substrate by stalk in deep waters.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Echinoderm	{"Deep Waters","Rocky Substrates","Current Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
216	Yellowfin Tuna	Thunnus albacares	Large, fast-swimming pelagic fish with distinctive yellow fins. Important commercial species and apex predator.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Fish	{"Open Ocean","Pelagic Waters","Warm Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
217	Mahi-Mahi	Coryphaena hippurus	Colorful dolphinfish with compressed body and long dorsal fin. Fast-growing pelagic species with golden coloration.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Warm Waters","Surface Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
218	Sailfish	Istiophorus platypterus	Fastest fish in the ocean with distinctive sail-like dorsal fin. Uses speed and teamwork to hunt schooling fish.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Tropical Waters","Surface Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
219	Marlin	Makaira nigricans	Large billfish with spear-like upper jaw. Powerful predator that can reach speeds over 50 mph.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Fish	{"Open Ocean","Deep Waters","Tropical Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
220	Wahoo	Acanthocybium solandri	Fast pelagic fish with razor-sharp teeth and streamlined body. Known for incredible bursts of speed.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Warm Waters","Continental Shelf"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
221	Cobia	Rachycentron canadum	Large brown fish with shark-like appearance but no relation to sharks. Curious and often approaches divers.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Continental Shelf","Warm Waters","Structure Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
222	Amberjack	Seriola dumerili	Large predatory fish with powerful build and amber coloration. Forms schools and hunts cooperatively.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Continental Shelf",Reefs,"Open Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
223	Tarpon	Megalops atlanticus	Large silver fish capable of spectacular jumps when hooked. Important game fish with prehistoric lineage.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Fish	{"Coastal Waters",Estuaries,"Shallow Bays"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
224	Permit	Trachinotus falcatus	Silvery fish with diamond-shaped body and black fin tips. Highly prized by sport fishermen for wariness.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Shallow Flats",Reefs,"Sandy Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
225	Bonefish	Albula vulpes	Silvery fish with streamlined body perfectly adapted for shallow water feeding. Ghost of the flats.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Fish	{"Shallow Flats","Seagrass Beds","Sandy Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
226	Roosterfish	Nematistius pectoralis	Distinctive fish with comb-like dorsal fin that can be raised like a rooster crest. Endemic to Eastern Pacific.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Shores","Sandy Beaches","Warm Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
227	Pompano	Trachinotus carolinus	Silver fish with deep, compressed body and forked tail. Excellent table fare and important recreational species.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Shallow Waters","Sandy Beaches","Surf Zone"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
228	Snook	Centropomus undecimalis	Silvery fish with distinctive black lateral line and protruding lower jaw. Temperature-sensitive tropical species.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{Mangroves,Estuaries,"Warm Coastal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
229	Redfish	Sciaenops ocellatus	Copper-colored drum with distinctive spot near tail. Important recreational species in shallow coastal waters.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Shallow Bays","Grass Flats","Oyster Bars"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
230	Spotted Seatrout	Cynoscion nebulosus	Popular game fish with distinctive spots and weak mouth that tears easily. Makes drumming sounds.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Seagrass Beds","Shallow Bays",Estuaries}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
231	Flounder	Paralichthys dentatus	Flatfish with both eyes on one side of head. Master of camouflage that buries in sand to ambush prey.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sandy Bottom","Shallow Bays",Estuaries}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
232	Halibut	Hippoglossus hippoglossus	Largest flatfish that can grow over 400 pounds. Important commercial species in cold northern waters.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Fish	{"Continental Shelf","Deep Waters","Cold Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
233	Cod	Gadus morhua	Important commercial fish with three dorsal fins and barbel under chin. Historically overfished in many areas.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Fish	{"Continental Shelf","Cold Waters","Bottom Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
234	Haddock	Melanogrammus aeglefinus	Cod relative with distinctive dark spot behind gills and three dorsal fins. Important in North Atlantic fisheries.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Continental Shelf","Rocky Bottom","Cold Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
235	Pollock	Pollachius pollachius	Silver-sided fish related to cod with more elongated body. Forms large schools in open water.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Waters","Continental Shelf","Temperate Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
236	Sea Bass	Dicentrarchus labrax	Predatory fish with silver sides and spiny dorsal fin. Popular both commercially and recreationally.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Shores",Estuaries,"Coastal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
237	Rockfish	Sebastes spp.	Long-lived fish with spiny fins that live among rocky reefs. Many species are slow-growing and vulnerable.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Varies by Species	Fish	{"Rocky Reefs","Kelp Forests","Deep Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
238	Lingcod	Ophiodon elongatus	Large predatory fish with massive mouth and sharp teeth. Not actually a cod despite the name.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reefs","Kelp Forests","Deep Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
239	Salmon	Salmo salar	Anadromous fish that migrates between fresh and salt water. Culturally and economically important species.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{Rivers,"Coastal Waters","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
240	Mackerel	Scomber scombrus	Fast-swimming schooling fish with distinctive wavy lines on back. Important commercial and forage species.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Waters","Continental Shelf","Schooling Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
241	Mako Shark	Isurus oxyrinchus	Fastest shark species capable of reaching speeds over 60 mph. Powerful jumper known for spectacular leaps.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Shark	{"Open Ocean","Warm Waters","Pelagic Zone"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
242	Blue Shark	Prionace glauca	Slender shark with brilliant blue coloration and long pectoral fins. Most wide-ranging shark species.	https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Open Ocean","Deep Waters","All Oceans"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
243	Basking Shark	Cetorhinus maximus	Second largest fish in the world that feeds on plankton by filter feeding. Gentle giant of the seas.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Shark	{"Open Ocean","Coastal Waters","Plankton Rich Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
244	Whale Shark	Rhincodon typus	Largest fish in the world that feeds on plankton and small fish. Distinctive spotted pattern unique to each individual.	https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Shark	{"Warm Waters","Plankton Rich Areas","Coral Reefs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
245	Goblin Shark	Mitsukurina owstoni	Ancient deep-sea shark with extendable jaw mechanism. Living fossil found in deep waters worldwide.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Deep Ocean","Continental Slopes","Abyssal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
246	Gray Whale	Eschrichtius robustus	Baleen whale known for epic migrations along Pacific coast. Feeds by filtering sediment in shallow waters.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mammal	{"Coastal Waters","Migration Routes","Feeding Lagoons"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
247	Minke Whale	Balaenoptera acutorostrata	Smallest baleen whale with pointed head and white band on pectoral fins. Most common whale in many areas.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mammal	{"Coastal Waters","Continental Shelf","Polar Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
248	Right Whale	Eubalaena glacialis	Large whale with distinctive callosities on head. Critically endangered with fewer than 400 individuals remaining.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Mammal	{"Coastal Waters","Feeding Areas","Calving Grounds"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
249	Fin Whale	Balaenoptera physalus	Second largest whale species with asymmetrical jaw coloration. Fast swimmer reaching speeds up to 25 mph.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Mammal	{"Open Ocean","Deep Waters","All Oceans"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
250	Narwhal	Monodon monoceros	Arctic whale famous for long spiral tusk used for social interactions and sensing environment.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Mammal	{"Arctic Waters","Ice Edges","Deep Arctic Bays"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
251	Box Jellyfish	Chironex fleckeri	Highly venomous jellyfish with transparent box-shaped bell and trailing tentacles. Extremely dangerous to humans.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Tropical Waters","Shallow Bays","Coastal Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
252	Portuguese Man o War	Physalia physalis	Colonial organism with gas-filled bladder and long stinging tentacles. Not actually a jellyfish.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Open Ocean","Surface Waters","Warm Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
253	Sea Nettle	Chrysaora quinquecirrha	Common jellyfish with distinctive radial pattern and moderate sting. Forms seasonal blooms in many areas.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{Estuaries,"Coastal Waters","Brackish Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
254	Lion Mane Jellyfish	Cyanea capillata	Largest known jellyfish species with extremely long trailing tentacles. Found in cold northern waters.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Cold Waters","Open Ocean","Northern Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
255	Sea Pen	Ptilosarcus gurneyi	Colonial cnidarian that resembles an old-fashioned quill pen. Anchors in soft sediment with bulbous base.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Soft Sediment","Deep Waters","Current Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
256	Sea Fan	Gorgonia ventalina	Large colonial coral that grows in fan shape perpendicular to current for optimal feeding.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Coral	{"Reef Walls","Current Areas","Deep Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
257	Sea Whip	Leptogorgia virgulata	Flexible colonial coral that sways with current. Important habitat for small fish and invertebrates.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Coral	{"Rocky Areas","Moderate Current","Reef Slopes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
258	Hydroid	Obelia geniculata	Small colonial cnidarian that forms feathery colonies on hard surfaces. Important food for many small animals.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Hard Substrates","Shallow Waters","Fouling Communities"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
259	Anglerfish	Lophius piscatorius	Deep-sea predator with bioluminescent lure to attract prey in darkness. Females much larger than parasitic males.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Ocean","Continental Slope","Abyssal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
260	Viperfish	Chauliodus sloani	Deep-sea predator with needle-like teeth and bioluminescent photophores. Migrates vertically to hunt at night.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Ocean","Mesopelagic Zone","Open Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
261	Lanternfish	Myctophum punctatum	Small deep-sea fish with bioluminescent spots. Most abundant vertebrate on Earth by biomass.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Ocean","Vertical Migration","Plankton Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
262	Hatchetfish	Argyropelecus hemigymnus	Deep-sea fish with silver reflective sides and bioluminescent belly. Perfectly camouflaged from below.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Mesopelagic Zone","Open Ocean","Counter-illumination Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
263	Gulper Eel	Eurypharynx pelecanoides	Deep-sea eel with enormous mouth that can unhinge to swallow large prey. Long whip-like tail with light organ.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Ocean","Abyssal Waters","Open Deep Sea"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
264	Barreleye Fish	Macropinna microstoma	Transparent-headed fish with tubular eyes that can rotate upward to look for prey silhouettes above.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Ocean","Mesopelagic Waters","Jellyfish Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
265	Vampire Squid	Vampyroteuthis infernalis	Deep-sea cephalopod that can turn itself inside out for protection. Not actually a squid despite the name.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Oxygen Minimum Zone","Deep Ocean","Low Oxygen Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
266	Giant Isopod	Bathynomus giganteus	Large deep-sea crustacean related to pill bugs. Scavenger that can survive long periods without food.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Deep Ocean Floor","Continental Slope","Scavenging Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
267	Tripod Fish	Bathypterois grallator	Deep-sea fish that stands on seafloor using elongated fin rays like a tripod. Waits motionless for prey.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Abyssal Plain","Deep Seafloor","Soft Sediment"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
268	Snailfish	Pseudoliparis swirei	Deepest living fish found at record depths over 8000 meters. Gelatinous body adapted for extreme pressure.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Hadal Zone","Ocean Trenches","Extreme Depths"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
269	Dumbo Octopus	Grimpoteuthis spp.	Deep-sea octopus with ear-like fins that flutter as it swims. Lives at depths up to 7000 meters.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Deep Ocean","Abyssal Waters","Soft Sediment"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
270	Deep Sea Dragonfish	Stomias boa	Bioluminescent predator with large mouth and photophores along body. Red bioluminescence invisible to most prey.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Mesopelagic Zone","Deep Waters","Hunting Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
271	Fangtooth	Anoplogaster cornuta	Deep-sea fish with proportionally largest teeth of any fish. Young and adults live at different depths.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Ocean","Mesopelagic Zone","Open Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
272	Chimaera	Chimaera monstrosa	Cartilaginous fish related to sharks and rays with rabbit-like teeth. Also called ghost sharks or ratfish.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Fish	{"Continental Slope","Deep Waters","Cold Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
273	Giant Tube Worm	Riftia pachyptila	Massive tube worm found at hydrothermal vents. Lives without sunlight using chemosynthetic bacteria.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Hydrothermal Vents","Deep Ocean","Chemosynthetic Communities"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
274	Arctic Char	Salvelinus alpinus	Cold-water fish related to salmon and trout. One of the northernmost freshwater fish but also marine forms exist.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Cold Seas","Arctic Waters","Coastal Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
275	Greenland Shark	Somniosus microcephalus	Longest-lived vertebrate on Earth, potentially living over 400 years. Slow-moving Arctic predator.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Arctic Waters","Deep Cold Seas","Ice-covered Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
279	Bowhead Whale	Balaena mysticetus	Arctic whale with massive head and longest baleen of any whale. Can live over 200 years.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mammal	{"Arctic Waters","Ice-covered Seas","Shallow Arctic Bays"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
280	Arctic Cod	Boreogadus saida	Key Arctic fish species that supports entire Arctic food web. Adapted to extremely cold temperatures.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Arctic Waters","Under-ice Areas","Cold Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
281	King Crab	Paralithodes camtschaticus	Large crab with spiny shell and powerful claws. Important commercial species in cold northern waters.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Cold Waters","Continental Shelf","Rocky Bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
282	Snow Crab	Chionoecetes opilio	Cold-water crab with long legs and sweet meat. Forms large aggregations on muddy bottoms.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Cold Waters","Muddy Bottom","Continental Shelf"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
283	Arctic Tern	Sterna paradisaea	Seabird with longest migration of any animal, traveling from Arctic to Antarctic annually. Marine forager.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Bird	{"Arctic Seas","Open Ocean","Coastal Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
284	Flying Fish	Exocoetus volitans	Fish with enlarged pectoral fins that enable gliding flight above water surface to escape predators.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Surface Waters","Open Ocean","Warm Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
285	Cleaner Wrasse	Labroides dimidiatus	Small fish that provides cleaning services to other fish by removing parasites and dead tissue.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Cleaning Stations","Coral Reef","Service Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
286	Mimic Octopus	Thaumoctopus mimicus	Octopus capable of mimicking other marine animals including flatfish, lionfish, and stingrays.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Sandy Areas","Coral Reef","Camouflage Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
287	Leafy Sea Dragon	Phycodurus eques	Ornate relative of seahorses with elaborate leaf-like appendages for camouflage among seaweed.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Fish	{"Kelp Forests","Seaweed Areas","Temperate Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
288	Weedy Sea Dragon	Phyllopteryx taeniolatus	Less ornate sea dragon with ribbon-like appendages. Endemic to southern Australian waters.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Fish	{"Rocky Reefs","Kelp Areas","Temperate Coasts"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
289	Mandarin Dragonet	Synchiropus splendidus	Colorful small fish with psychedelic patterns. One of few vertebrates with blue pigment cells.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Rubble","Protected Lagoons","Shallow Reefs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
292	Tropical Gar	Atractosteus tropicus	Primitive fish with armor-like scales and needle-like teeth. Can breathe air using swim bladder.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coastal Rivers","Brackish Waters","Tropical Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
293	Surgeonfish	Acanthurus coeruleus	Blue tang with sharp spines near tail used for defense. Important herbivore controlling algae growth.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reefs","Algae Gardens","Grazing Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
294	Sunfish	Mola mola	Largest bony fish with flattened disc-like body. Feeds primarily on jellyfish despite massive size.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Fish	{"Open Ocean","Jellyfish Areas","Surface Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
295	Oarfish	Regalecus glesne	Longest bony fish reaching up to 17 meters. Rarely seen alive as it lives in deep waters.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Ocean","Mesopelagic Waters","Open Deep Sea"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
296	Frilled Shark	Chlamydoselachus anguineus	Primitive shark resembling an eel with six gill slits. Living fossil from deep waters.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Deep Waters","Continental Slopes","Ancient Lineage"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
297	Sixgill Shark	Hexanchus griseus	Primitive shark with six gill slits instead of five. Ancient species that has changed little.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Deep Waters","Continental Shelf","Ancient Habitats"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
298	Paddlefish	Polyodon spathula	Primitive fish with paddle-shaped snout used for filter feeding. Related to sturgeons.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Fish	{"Large Rivers","Brackish Waters","Open Water Filter Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
299	Gar	Lepisosteus osseus	Primitive fish with armor-like scales and long snout filled with sharp teeth. Living fossil.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Shallow Waters","Vegetation Areas","Warm Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
300	Bowfin	Amia calva	Ancient fish with ability to breathe air. Only surviving member of ancient fish order.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Shallow Waters",Vegetation,"Warm Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
301	Coelacanth	Latimeria chalumnae	Living fossil thought extinct until rediscovered in 1938. Ancient lobe-finned fish with limb-like fins.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Fish	{"Deep Rocky Areas","Underwater Caves","Ancient Refugia"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
302	Lamprey	Petromyzon marinus	Jawless parasitic fish with circular sucker mouth. Ancient vertebrate that attaches to other fish.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{Rivers,"Coastal Waters","Host Fish Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
303	Hagfish	Eptatretus stoutii	Jawless scavenger that produces slime when threatened. Most primitive vertebrate alive today.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Ocean Floor","Scavenging Areas","Muddy Bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
304	Albatross	Diomedea exulans	Largest seabird with wingspan over 3 meters. Master of dynamic soaring over ocean waves.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Bird	{"Open Ocean","Windy Seas","Remote Islands"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
305	Pelican	Pelecanus occidentalis	Large seabird with enormous bill and throat pouch for catching fish. Spectacular diving hunter.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Bird	{"Coastal Waters","Fishing Areas","Shallow Bays"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
306	Gannet	Morus bassanus	Seabird with streamlined body for high-speed diving from great heights to catch fish.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Bird	{"Coastal Cliffs","Fish Schools","Open Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
307	Frigatebird	Fregata magnificens	Seabird with inflatable red throat pouch and piratical habits of stealing food from other birds.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Bird	{"Tropical Seas","Breeding Colonies","Coastal Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
308	Penguin	Spheniscus humboldti	Flightless seabird perfectly adapted for underwater swimming. Uses wings as flippers for propulsion.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Bird	{"Cold Seas","Rocky Shores","Fish-rich Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
309	Blobfish	Psychrolutes marcidus	Gelatinous deep-sea fish that appears normal at depth but becomes blob-like when brought to surface due to decompression.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Continental Shelves","High Pressure Waters","Cold Deep Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
310	Garibaldi Fish	Hypsypops rubicundus	Bright orange damselfish endemic to California. Males aggressively defend algae gardens and nests.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Kelp Forests","Rocky Reefs","California Coast"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
311	Handfish	Brachionichthys hirsutus	Rare fish that walks on seafloor using modified fins like hands. Critically endangered Tasmanian endemic.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Fish	{"Sandy Bottom","Kelp Areas",Tasmania}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
312	Tasselled Wobbegong	Eucrossorhinus dasypogon	Ornate carpet shark with elaborate skin flaps for camouflage. Master of disguise among coral and rocks.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Coral Reefs","Rocky Areas","Camouflage Zones"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
313	Zebra Shark	Stegostoma fasciatum	Spotted shark with distinctive ridged body. Juveniles have stripes that change to spots as adults.	https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Shark	{"Coral Reefs","Sandy Areas","Tropical Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
314	Epaulette Shark	Hemiscyllium ocellatum	Small shark that can walk on land using fins. Tolerates low oxygen and can survive out of water briefly.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Tide Pools","Shallow Reefs","Rocky Shores"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
315	Cookiecutter Shark	Isistius brasiliensis	Small shark that takes circular bites from larger marine animals. Bioluminescent with unique feeding behavior.	https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Deep Waters","Open Ocean","Large Animal Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
316	Flashlight Fish	Photoblepharon palpebratum	Fish with bioluminescent organs under eyes that can be controlled like shutters for communication and hunting.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Reefs","Night Waters","Cave Openings"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
317	Grunt Sculpin	Rhamphocottus richardsonii	Unusual fish that can inflate like a pufferfish and makes grunting sounds. Has prominent lips and spines.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Areas","Kelp Forests","Temperate Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
319	Vampire Crab	Geosesarma dennerle	Small freshwater crab with purple claws and terrestrial habits. Recently discovered colorful species.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Data Deficient	Crustacean	{"Coastal Streams","Rocky Areas","Terrestrial-Marine Interface"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
320	Yeti Crab	Kiwa hirsuta	Hairy crab discovered at hydrothermal vents. Bacteria on hair may help detoxify harmful chemicals.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Data Deficient	Crustacean	{"Hydrothermal Vents","Deep Ocean","Chemosynthetic Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
321	Japanese Spider Crab	Macrocheira kaempferi	Largest arthropod with leg span reaching 4 meters. Long-lived deep-water scavenger.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Crustacean	{"Deep Waters","Continental Shelf","Rocky Bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
322	Blanket Octopus	Tremoctopus violaceus	Octopus with extreme sexual dimorphism - females 40,000 times larger than males. Males live as parasites.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Open Ocean","Pelagic Waters","Warm Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
323	Glass Sponge	Euplectella aspergillum	Deep-sea sponge with intricate glass skeleton. Often houses pairs of shrimp that become trapped inside.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Sponge	{"Deep Ocean","Soft Bottom","Glass Sponge Reefs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
324	Pyrosome	Pyrosoma atlanticum	Colonial organism forming tube-like structures that can grow over 18 meters long. Bioluminescent filter feeder.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Tunicate	{"Open Ocean","Warm Waters","Vertical Migration Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
325	Sea Pig	Scotoplanes globosa	Deep-sea sea cucumber that walks on seafloor in herds. Important deep-ocean scavenger.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Echinoderm	{"Abyssal Plains","Deep Ocean Floor","Organic Falls"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
326	Barrel Sponge	Xestospongia testudinaria	Large sponge that can live over 1000 years. Important habitat for many reef fish and invertebrates.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Sponge	{"Coral Reefs","Deep Walls","Current-swept Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
327	Crown Jellyfish	Netrostoma setouchina	Deep-sea jellyfish with crown-like appearance and bioluminescent capabilities. Rarely observed alive.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Deep Ocean","Midwater Column","Dark Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
329	Bluefin Tuna	Thunnus thynnus	Largest and most valuable tuna species. Warm-blooded fish capable of incredible speed and endurance.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Fish	{"Open Ocean","Temperate Seas","Migration Routes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
330	Atlantic Salmon	Salmo salar	Anadromous fish that returns to natal streams to spawn. Important aquaculture and wild fishery species.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{Rivers,"Coastal Waters","North Atlantic"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
331	Lobster	Homarus americanus	Large marine crustacean with powerful claws. Important commercial species in North Atlantic.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Rocky Bottom","Continental Shelf","Cold Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
332	Dungeness Crab	Metacarcinus magister	Commercial crab species from Pacific coast. Important fishery with strict seasonal regulations.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Sandy Bottom",Estuaries,"Pacific Coast"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
333	Oyster	Crassostrea virginica	Filter-feeding bivalve important for water quality and as food. Forms extensive reef structures.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{Estuaries,"Shallow Bays","Hard Substrates"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
334	Mussel	Mytilus edulis	Filter-feeding bivalve that forms dense beds on rocky shores. Important food source and ecosystem engineer.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Rocky Shores","Intertidal Zone","Pier Pilings"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
335	Sea Scallop	Placopecten magellanicus	Large swimming bivalve with fan-shaped shell. Important commercial species harvested by dredging.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Continental Shelf","Sandy Bottom","Open Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
336	Shrimp	Penaeus setiferus	Commercial penaeid shrimp important in Gulf Coast fisheries. Spends part of life cycle in estuaries.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{Estuaries,"Shallow Waters","Gulf Coast"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
337	Striped Bass	Morone saxatilis	Anadromous fish important for both commercial and recreational fishing. Makes coastal migrations.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coastal Waters",Estuaries,"Migration Routes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
338	Bluefish	Pomatomus saltatrix	Aggressive predatory fish that travels in schools. Important recreational species along Atlantic coast.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Continental Shelf","Schooling Areas","Atlantic Coast"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
339	Summer Flounder	Paralichthys dentatus	Flatfish important in commercial and recreational fisheries. Expert at camouflage on sandy bottom.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sandy Bottom",Estuaries,"Continental Shelf"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
340	Red Snapper	Lutjanus campechanus	Popular reef fish important in Gulf of Mexico fisheries. Long-lived species with strict management.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Fish	{"Continental Shelf","Reef Areas","Gulf of Mexico"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
341	Grouper	Epinephelus morio	Large predatory reef fish important in commercial fisheries. Slow-growing and long-lived.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Fish	{"Coral Reefs","Rocky Areas","Deep Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
342	Swordfish	Xiphias gladius	Large billfish with sword-like bill. Important commercial species caught by longline fishing.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Deep Waters","Temperate Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
343	Albacore Tuna	Thunnus alalunga	Medium-sized tuna with long pectoral fins. Important commercial species for canned tuna industry.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Fish	{"Open Ocean","Temperate Waters","Migration Routes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
344	Lionfish	Pterois miles	Venomous Indo-Pacific fish that has invaded Atlantic waters. Voracious predator disrupting native ecosystems.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reefs","Rocky Areas","Invaded Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
345	Asian Shore Crab	Hemigrapsus sanguineus	Small crab from Asia that has colonized Atlantic shores. Competes with native crab species.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Rocky Shores","Tide Pools","Invaded Coasts"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
346	European Green Crab	Carcinus maenas	Aggressive crab species that has invaded many coastlines worldwide. Impacts native shellfish.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{Estuaries,"Rocky Shores","Invaded Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
347	Zebra Mussel	Dreissena polymorpha	Small bivalve that forms dense colonies and clogs water systems. Major aquatic invasive species.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Hard Substrates","Water Systems","Invaded Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
348	Round Goby	Neogobius melanostomus	Small bottom-dwelling fish from Eurasia. Aggressive competitor that has spread through Great Lakes.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Bottom","Shallow Waters","Invaded Systems"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
349	Northern Snakehead	Channa argus	Air-breathing predatory fish that can survive on land. Invasive species threatening native fish.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{Freshwater,Marshes,"Invaded Watersheds"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
350	Asian Carp	Hypophthalmichthys molitrix	Large filter-feeding fish that dominates invaded waterways. Threatens native fish communities.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{Rivers,"Large Water Bodies","Invaded Systems"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
351	Sea Walnut	Mnemiopsis leidyi	Comb jelly that has invaded many marine ecosystems worldwide. Voracious predator of zooplankton.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Ctenophore	{"Coastal Waters",Estuaries,"Invaded Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
352	Wakame Seaweed	Undaria pinnatifida	Large kelp species that has spread globally from Asia. Competes with native seaweed communities.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Algae	{"Rocky Shores","Subtidal Areas","Invaded Coasts"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
353	Caulerpa	Caulerpa taxifolia	Fast-growing green algae that can carpet entire seafloors. Known as killer algae for its invasive nature.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Algae	{Mediterranean,"Warm Waters","Invaded Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
354	Copepod	Calanus finmarchicus	Tiny crustacean that forms the base of many marine food webs. Most abundant multicellular animal on Earth.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Open Ocean","Plankton Rich Waters","All Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
355	Salp	Salpa fusiformis	Transparent tunicate that forms long chains while filter feeding. Important in ocean carbon cycling.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Tunicate	{"Open Ocean","Vertical Migration","Warm Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
356	Diatom	Thalassiosira pseudonana	Microscopic single-celled algae with intricate glass shells. Foundation of marine food webs.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Phytoplankton	{"Surface Waters","Photic Zone","All Oceans"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
357	Dinoflagellate	Noctiluca scintillans	Bioluminescent single-celled organism that creates glowing waves at night. Can form harmful algal blooms.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Phytoplankton	{"Surface Waters","Coastal Areas","Warm Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
358	Radiolarian	Spumellaria spp.	Single-celled organism with intricate silica skeletons. Important component of marine plankton.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Protozoa	{"Open Ocean","Deep Waters","All Marine Environments"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
359	Cleaner Fish	Labroides bicolor	Specialized wrasse that removes parasites from other fish. Essential service provider in reef ecosystems.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Cleaning Stations","Coral Reef","Service Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
360	Anemone Crab	Neopetrolisthes ohshimai	Small crab that lives symbiotically with sea anemones, gaining protection from stinging tentacles.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Sea Anemones","Coral Reef","Symbiotic Relationships"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
361	Goby	Cryptocentrus cinctus	Small fish that shares burrows with pistol shrimp in mutually beneficial partnership.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sandy Bottom","Shared Burrows","Symbiotic Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
362	Pea Crab	Pinnotheres pisum	Tiny crab that lives inside oysters and mussels, feeding on plankton filtered by host.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Inside Bivalves","Oyster Beds","Mussel Colonies"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
363	Parasitic Isopod	Cymothoa exigua	Isopod that replaces fish tongues and feeds on blood and mucus. Only known parasite to replace organ.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Fish Mouths","Parasitic Lifestyle","Host Fish"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
364	Clownfish Anemone	Entacmaea quadricolor	Sea anemone that provides protection for clownfish in exchange for food and cleaning services.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Coral Reef","Clownfish Partnerships","Shallow Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
365	Zoanthid	Palythoa caribaeorum	Colonial anemone that often grows on hermit crab shells, providing camouflage and protection.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Rocky Areas","Hermit Crab Shells","Coral Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
366	Tongue Worm	Pentastomida spp.	Parasitic arthropod that lives in respiratory systems of marine vertebrates.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Parasite	{"Inside Host Lungs","Marine Mammal Parasites","Respiratory Systems"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
367	Anglerfish Lure Bacteria	Vibrio fischeri	Bioluminescent bacteria living in anglerfish lures, providing light in exchange for nutrients.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Bacteria	{"Anglerfish Lures","Deep Sea","Bioluminescent Organs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
368	Shark Sucker	Echeneis naucrates	Fish with suction disc that attaches to sharks and other large marine animals for transportation.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Attached to Sharks","Large Marine Animals","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
369	Coral Crab	Trapezia cymodoce	Small crab that lives exclusively in staghorn coral, defending it from crown-of-thorns starfish.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Staghorn Coral","Coral Branches","Reef Defense"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
370	Cleaning Shrimp	Stenopus hispidus	Banded shrimp that operates cleaning stations, removing parasites from fish clients.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Cleaning Stations","Rock Crevices","Service Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
371	Sponge Crab	Dromia personata	Crab that carries live sponges on its back for camouflage and protection from predators.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Rocky Areas","Sponge Gardens","Camouflaged Habitats"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
372	Fish Louse	Argulus foliaceus	Parasitic crustacean that attaches to fish skin and feeds on blood and tissue fluids.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Fish Skin","Parasitic Lifestyle","Host Fish"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
373	Monkfish Lure	Haplophryne mollis	Deep-sea anglerfish with bioluminescent lure containing symbiotic bacteria for attracting prey.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Ocean","Bioluminescent Zones","Predatory Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
374	Crystal Jelly	Aequorea victoria	Transparent jellyfish that produces green fluorescent protein, revolutionizing medical research.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Temperate Waters","Open Ocean","Research Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
375	Firefly Squid	Watasenia scintillans	Small squid covered in bioluminescent photophores. Creates spectacular light displays during mating.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Deep Waters","Japanese Coast","Spawning Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
376	Atolla Jellyfish	Atolla wyvillei	Deep-sea jellyfish with crown of bioluminescent lights. Creates burglar alarm display when threatened.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Deep Ocean","Midwater Zone","Defense Display Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
377	Hawaiian Bobtail Squid	Euprymna scolopes	Small squid with bioluminescent bacteria that provide camouflage by matching moonlight from below.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Sandy Bottom","Shallow Waters","Hawaiian Coast"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
378	Deep Sea Mushroom	Dendrogramma enigmatica	Mysterious bioluminescent organism resembling jellyfish but in its own unique group.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Data Deficient	Unknown	{"Deep Ocean","Continental Slope","Unknown Habitats"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
379	Ostracod	Vargula hilgendorfii	Tiny bioluminescent crustacean that creates blue light clouds when threatened. Living fireworks.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Open Waters","Coastal Areas","Defense Display Zones"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
380	Comb Jelly	Mnemiopsis leidyi	Transparent marine animal with iridescent rainbow combs that refract light as it swims.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Ctenophore	{"Coastal Waters",Estuaries,"Planktonic Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
381	Bioluminescent Plankton	Pyrodinium bahamense	Dinoflagellate that creates glowing wakes and blue tears phenomenon in disturbed water.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Phytoplankton	{"Warm Waters","Coastal Bays","Disturbance Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
382	Deep Sea Worm	Tomopteris helgolandicus	Transparent polychaete worm that produces yellow bioluminescent mucus when threatened.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Deep Waters","Open Ocean","Planktonic Zone"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
383	Glowing Shark	Etmopterus lucifer	Small deep-water shark with bioluminescent belly that provides counter-illumination camouflage.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Deep Waters","Continental Slope","Midwater Zone"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
384	Electric Eel	Electrophorus electricus	Fish capable of generating 600-volt electric shocks for hunting and defense. Not actually an eel.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Freshwater Rivers","Amazon Basin","Muddy Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
385	Elephant Nose Fish	Gnathonemus petersii	Freshwater fish with electrical organs for navigation and communication in murky water.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"African Rivers","Muddy Waters","Electrical Navigation"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
386	Hammerhead Shark	Sphyrna lewini	Shark with flattened head containing electroreceptors for detecting buried prey and navigation.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Shark	{"Open Ocean","Continental Shelves","Schooling Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
387	Platypus	Ornithorhynchus anatinus	Unique mammal with electroreception capabilities for finding prey underwater in murky streams.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Mammal	{"Freshwater Streams","River Banks","Australian Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
388	Skate	Leucoraja erinacea	Cartilaginous fish with powerful electroreception for detecting buried prey in sand and mud.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Ray	{"Sandy Bottom","Continental Shelf","Benthic Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
389	Ghost Knifefish	Apteronotus albifrons	Fish that generates continuous electric fields for navigation and communication in dark waters.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"South American Rivers","Murky Waters","Electric Navigation"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
390	Chimaera	Hydrolagus colliei	Ancient cartilaginous fish with electroreception and lateral line system for detecting water movements.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Deep Waters","Continental Slopes","Cold Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
391	Sawfish	Pristis pectinata	Ray with saw-like rostrum containing electroreceptors for detecting prey buried in sediment.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Ray	{"Shallow Coastal Waters",Estuaries,"Sawgrass Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
392	Pompeii Worm	Alvinella pompejana	Worm that lives at hydrothermal vents in temperatures up to 80°C. Most heat-tolerant animal known.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Hydrothermal Vents","Extreme Heat","Deep Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
393	Brine Shrimp	Artemia salina	Crustacean that survives in extremely salty water and can enter cryptobiotic state for years.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Salt Lakes","Hypersaline Waters","Extreme Salinity"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
394	Ice Fish	Channichthyidae family	Antarctic fish with antifreeze proteins in blood and no red blood cells. Adapted to sub-zero waters.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Antarctic Waters","Sub-zero Temperatures","Ice-covered Seas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
395	Tardigrade	Hypsibius dujardini	Microscopic water bear that can survive extreme conditions including space vacuum and radiation.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Tardigrade	{Everywhere,"Extreme Conditions","Survival Specialist"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
396	Tube Worm	Riftia pachyptila	Giant worm living at hydrothermal vents without digestive system, relying on chemosynthetic bacteria.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Hydrothermal Vents","Chemosynthetic Communities","High Pressure"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
397	Halophilic Archaea	Halobacterium salinarum	Extremophile microorganism that thrives in extremely salty environments and produces purple pigments.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Archaea	{"Hypersaline Lakes","Salt Crystals","Extreme Salinity"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
398	Barophilic Bacteria	Pyrococcus yayanosii	Microorganism that requires extreme pressure to survive, living in deepest ocean trenches.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Bacteria	{"Deep Ocean Trenches","Extreme Pressure","Abyssal Depths"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
399	Antarctic Krill	Euphausia superba	Cold-adapted crustacean that forms massive swarms under Antarctic ice, foundation of polar food webs.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Antarctic Waters","Under Ice","Cold Swarms"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
400	Methane Seep Clam	Calyptogena magnifica	Giant clam that lives at methane seeps, housing chemosynthetic bacteria in specialized organs.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Methane Seeps","Deep Ocean","Chemosynthetic Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
401	Acidophilic Bacteria	Ferroplasma acidarmanus	Extremophile that thrives in extremely acidic conditions found in marine volcanic areas.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Bacteria	{"Volcanic Vents","Acidic Waters","Extreme pH"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
402	Deep Sea Scavenger	Bathynomus doederleini	Giant isopod adapted to extreme pressure and food scarcity in deep ocean trenches.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Deep Ocean Trenches","Extreme Pressure","Scavenging Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
403	Xenophyophore	Stannophyllum zonarium	Giant single-celled organism found in deep sea, one of largest known unicellular life forms.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Protozoa	{"Abyssal Plains","Deep Seafloor","Unicellular Giants"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
404	Blue-ringed Octopus	Hapalochlaena maculosa	Small but extremely venomous octopus with blue warning rings. Bite can kill humans within minutes.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Tide Pools","Shallow Reefs","Rocky Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
405	Sea Wasp	Chironex fleckeri	Extremely venomous box jellyfish considered one of most dangerous marine animals to humans.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Tropical Waters","Shallow Bays","Northern Australia"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
406	Stonefish	Synanceia horrida	Most venomous fish in the world with spines that inject deadly toxin. Master of camouflage.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reefs","Rocky Areas","Camouflaged Positions"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
407	Irukandji Jellyfish	Carukia barnesi	Tiny but extremely venomous jellyfish with delayed but potentially fatal sting syndrome.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Tropical Waters","Open Ocean","Australian Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
408	Beaked Sea Snake	Hydrophis schistosus	Most venomous sea snake with potent neurotoxic venom. Aggressive when threatened or during mating.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Reptile	{"Warm Coastal Waters","Coral Reefs",Indo-Pacific}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
409	Garibaldi	Hypsypops rubicundus	California state marine fish with bright orange coloration. Males defend territories and tend nests aggressively.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Kelp Forests","Rocky Reefs","California Coast"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
410	Sea Otter	Enhydra lutris	Marine mammal that uses tools to crack open sea urchins. Keystone species maintaining kelp forest ecosystems.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Mammal	{"Kelp Forests","Rocky Shores","Cold Coastal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
411	Giant Kelp	Macrocystis pyrifera	Largest brown algae forming underwater forests. Can grow 60 cm per day in ideal conditions.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Algae	{"Cold Waters","Rocky Substrates","High Nutrient Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
412	Kelp Bass	Paralabrax clathratus	Predatory fish endemic to Southern California kelp forests. Important recreational fishing species.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Kelp Forests","Rocky Reefs","Southern California"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
413	Sheephead	Semicossyphus pulcher	Large wrasse with sex-changing ability. Males develop distinctive humped heads and different coloration.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Fish	{"Kelp Forests","Rocky Reefs","California Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
414	Horn Shark	Heterodontus francisci	Small shark that wedges itself into crevices using spine-locked fins. Feeds primarily on sea urchins.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Kelp Forests","Rocky Crevices","California Coast"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
415	Kelp Crab	Pugettia productus	Decorator crab that camouflages with kelp pieces. Changes decoration to match different kelp species.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Kelp Forests","Among Kelp Fronds","Camouflaged Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
416	Abalone	Haliotis fulgens	Large gastropod with iridescent shell that grazes on kelp and other algae. Severely overharvested.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Mollusk	{"Kelp Forests","Rocky Shores","Algae Gardens"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
417	Purple Sea Urchin	Strongylocentrotus purpuratus	Herbivorous echinoderm that can overgraze kelp forests when predators are absent.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Echinoderm	{"Kelp Forests","Rocky Areas","Grazing Zones"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
418	Red Sea Urchin	Mesocentrotus franciscanus	Large long-lived urchin that can live over 100 years. Important kelp forest herbivore.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Echinoderm	{"Kelp Forests","Deep Rocky Areas","Long-lived Colonies"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
419	Kelp Rockfish	Sebastes atrovirens	Fish that lives its entire life cycle within kelp forest canopy. Feeds on planktonic organisms.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Fish	{"Kelp Canopy","Mid-water Column","California Kelp Forests"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
422	Green Turtle	Chelonia mydas	Large sea turtle that shifts from carnivorous juvenile to herbivorous adult feeding on seagrass.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Reptile	{"Seagrass Beds","Coastal Waters","Nesting Beaches"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
423	Seagrass	Zostera marina	Marine flowering plant that forms underwater meadows. Critical nursery habitat for many species.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Plant	{"Shallow Coastal Waters",Estuaries,"Protected Bays"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
424	Pipefish	Syngnathus fuscus	Elongated fish perfectly camouflaged among seagrass blades. Males carry eggs in brood pouch.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Seagrass Beds","Shallow Waters","Camouflaged Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
425	Bay Scallop	Argopecten irradians	Small bivalve that lives attached to seagrass blades. Important filter feeder in seagrass ecosystems.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Mollusk	{"Seagrass Beds","Shallow Bays","Attachment Sites"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
426	Pinfish	Lagodon rhomboides	Small fish that feeds on seagrass and associated epiphytes. Important prey species for larger predators.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Seagrass Meadows","Shallow Waters","Grazing Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
427	Spider Crab	Libinia dubia	Long-legged crab that decorates itself with seagrass for camouflage. Slow-moving scavenger.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Seagrass Beds","Sandy Areas","Decorative Camouflage"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
428	Queen Conch	Aliger gigas	Large gastropod that grazes on seagrass beds. Important cultural and economic species in Caribbean.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Mollusk	{"Seagrass Beds","Sandy Areas","Caribbean Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
429	Seahorse	Hippocampus erectus	Unique fish with prehensile tail that grasps seagrass stems. Males carry and care for eggs.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Fish	{"Seagrass Beds","Shallow Waters","Grasping Sites"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
430	Grass Shrimp	Palaemonetes pugio	Small transparent shrimp that provides important link in seagrass food webs. Feeds on detritus.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Seagrass Beds","Shallow Estuaries","Detritus Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
431	Blue Marlin	Makaira nigricans	Largest billfish and apex pelagic predator. Can reach speeds over 50 mph when hunting.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Fish	{"Open Ocean","Warm Waters","Pelagic Zone"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
432	Flying Fish	Cypselurus heterurus	Fish with enlarged pectoral fins for gliding above water surface to escape predators.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Surface Waters","Escape Routes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
434	Ocean Sunfish	Mola mola	Heaviest bony fish with distinctive flattened appearance. Feeds primarily on jellyfish.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Fish	{"Open Ocean","Jellyfish Areas","Surface Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
435	Skipjack Tuna	Katsuwonus pelamis	Fast-swimming tuna that forms large schools in open ocean. Important commercial fishery.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Warm Waters","Schooling Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
436	Oceanic Whitetip Shark	Carcharhinus longimanus	Bold pelagic shark with distinctive white-tipped fins. Often accompanied by pilot fish.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Shark	{"Open Ocean","Deep Waters","Pelagic Zone"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
438	Pilot Whale	Globicephala macrorhynchus	Social toothed whale that follows food sources across ocean basins. Lives in family pods.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mammal	{"Deep Ocean","Continental Slope","Social Groups"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
439	Storm Petrel	Hydrobates pelagicus	Small seabird that appears to walk on water surface while feeding on plankton.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Bird	{"Open Ocean","Surface Waters","Storm Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
440	Sargassum Fish	Histrio histrio	Fish perfectly camouflaged to match floating sargassum seaweed. Lives entire life in open ocean.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Sargassum Mats","Open Ocean","Floating Habitat"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
441	Bluefin Tuna	Thunnus orientalis	Pacific bluefin tuna capable of warming body temperature above water temperature. Long-distance migrant.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Fish	{"Open Ocean","Migration Routes","Feeding Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
442	Shortfin Mako	Isurus oxyrinchus	Fastest shark species with ability to leap completely out of water. Warm-blooded predator.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Shark	{"Open Ocean","Warm Waters","High-speed Hunting"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
443	Paper Nautilus	Argonauta argo	Pelagic octopus where females create paper-thin shells for protection and buoyancy control.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Open Ocean","Surface Waters","Pelagic Drift"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
444	Dolphinfish	Coryphaena hippurus	Fast-growing pelagic fish with spectacular colors that change rapidly when excited or feeding.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Warm Surface Waters","Floating Objects"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
445	Sargassum Crab	Portunus sayi	Swimming crab that lives among floating sargassum mats in open ocean. Excellent swimmer.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Sargassum Mats","Open Ocean","Floating Habitat"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
447	Mangrove Snapper	Lutjanus griseus	Important food fish that uses mangroves as nursery habitat before moving to reef systems.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Mangrove Roots","Shallow Creeks","Nursery Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
448	Saltwater Crocodile	Crocodylus porosus	Largest living reptile that dominates mangrove waterways. Apex predator in tropical systems.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Reptile	{"Mangrove Channels",Estuaries,"Tropical Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
449	Fiddler Crab	Uca rapax	Small crab where males have one enlarged claw for territorial displays and courtship rituals.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Mangrove Mudflats","Tidal Areas","Burrow Systems"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
450	Mangrove Monitor	Varanus indicus	Large semi-aquatic lizard that hunts in mangrove systems. Excellent swimmer and climber.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Reptile	{"Mangrove Trees","Tidal Areas",Indo-Pacific}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
451	Mudskipper	Periophthalmus barbarus	Amphibious fish that can live on land and climb mangrove roots. Uses modified fins for locomotion.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Mangrove Mudflats","Tidal Zones","Amphibious Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
452	Archer Fish	Toxotes jaculatrix	Fish that shoots water jets to knock insects from mangrove branches. Remarkable accuracy and range.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Mangrove Channels","Under Overhanging Branches","Hunting Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
453	Mangrove Tree Crab	Aratus pisonii	Terrestrial crab that lives in mangrove canopy and feeds on leaves. Important decomposer.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Mangrove Canopy","Tree Branches","Leaf Litter"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
455	Sooty Shearwater	Ardenna grisea	Seabird that makes figure-8 migration around Pacific Ocean, covering 65,000 km annually.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Bird	{"Open Ocean","Pacific Migration Route","Breeding Islands"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
456	European Eel	Anguilla anguilla	Catadromous fish that spawns in Sargasso Sea then migrates to European rivers for most of life.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Fish	{"Sargasso Sea","Atlantic Ocean","European Rivers"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
458	Bar-tailed Godwit	Limosa lapponica	Shorebird that makes longest non-stop flight of any bird, 11,000 km from Alaska to New Zealand.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Bird	{"Coastal Areas","Migration Stopover","Arctic Breeding"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
459	Humphead Wrasse	Cheilinus undulatus	Massive reef fish with distinctive hump on forehead. Can live over 30 years and change sex from female to male.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Fish	{"Coral Reefs","Deep Reef Slopes",Indo-Pacific}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
460	Ornate Ghost Pipefish	Solenostomus paradoxus	Delicate fish with elaborate fins that mimics floating debris. Females carry eggs between pelvic fins.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reefs","Protected Areas","Mimicry Zones"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
461	Mandarin Dragonet	Pterosynchiropus splendidus	One of most colorful reef fish with intricate patterns. Secretes toxic mucus for protection.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Rubble","Protected Lagoons","Toxic Defense Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
462	Weedy Scorpionfish	Rhinopias frondosa	Master of camouflage with skin flaps resembling algae. Venomous spines provide additional protection.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reefs","Algae Gardens","Camouflaged Positions"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
463	Juvenile Batfish	Platax teira	Young batfish that mimic floating leaves or debris. Undergo dramatic transformation as adults.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Surface Waters","Mimicry Areas","Transformation Zones"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
464	Painted Lobster	Panulirus versicolor	Colorful tropical lobster with blue and orange markings. Important in reef ecosystems and local fisheries.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Coral Reefs","Rock Crevices","Tropical Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
465	Porcelain Crab	Petrolisthes cinctipes	Small crab that filter feeds using specialized mouthparts. Lives under rocks in intertidal zone.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Under Rocks","Intertidal Zone","Filter Feeding Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
466	Thorny Oyster	Spondylus americanus	Bivalve with spiny shell that cements to hard surfaces. Important habitat for small organisms.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Hard Substrates","Reef Areas","Attachment Sites"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
467	Tiger Cowrie	Cypraea tigris	Large gastropod with distinctive spotted shell. Active at night, hiding in crevices during day.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Coral Reefs","Rock Crevices","Night Activity Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
468	Lettuce Sea Slug	Elysia crispata	Solar-powered sea slug that incorporates chloroplasts from algae for photosynthesis.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Seagrass Beds","Algae Areas","Photosynthetic Zones"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
469	Basket Star	Astrophyton muricatum	Echinoderm with branching arms that form basket-like feeding structure. Filter feeds at night.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Echinoderm	{"Deep Reefs","Current Areas","Night Feeding Zones"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
470	Long-spined Urchin	Diadema antillarum	Black sea urchin with extremely long spines. Important algae grazer that maintains reef health.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Echinoderm	{"Coral Reefs","Grazing Areas","Algae Control Zones"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
471	Leather Coral	Sarcophyton trocheliophorum	Soft coral with leathery texture that can retract all polyps when threatened.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Coral	{"Coral Reefs","Current Areas","Soft Substrate"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
472	Bubble Coral	Plerogyra sinuosa	Coral with inflatable bubble-like vesicles that provide protection and enhance feeding.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Coral	{"Protected Reefs","Low Light Areas","Bubble Zones"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
473	Upside-down Jellyfish	Cassiopea xamachana	Jellyfish that lives upside-down on seafloor with symbiotic algae in its bell.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Shallow Lagoons","Sandy Bottom","Symbiotic Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
474	Tube Anemone	Cerianthus membranaceus	Solitary anemone that lives in tubes buried in sand with only tentacles exposed.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"Sandy Bottom","Tube Habitats","Buried Positions"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
475	Tube Worm	Sabellastarte spectabilis	Colorful polychaete worm with feathery feeding crown that retracts into protective tube.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Hard Substrates","Tube Colonies","Filter Feeding Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
476	Encrusting Sponge	Cliona celata	Boring sponge that tunnels into coral and shell, weakening reef structures over time.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Sponge	{"Coral Reefs","Shell Areas","Boring Activities"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
477	Rope Sponge	Amphimedon compressa	Branching sponge that forms rope-like structures providing habitat for many small organisms.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Sponge	{"Reef Walls","Current Areas","Branching Structures"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
478	Sea Squirt	Halocynthia pyriformis	Tunicate that filters large volumes of water through its body. Important in water quality.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Tunicate	{"Hard Substrates","Current Areas","Filter Communities"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
479	Colonial Tunicate	Botryllus schlosseri	Social tunicate forming colorful colonies with shared water circulation systems.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Tunicate	{"Dock Pilings","Hard Surfaces","Colonial Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
480	Bryozoan	Bugula neritina	Colonial animal forming lace-like structures. Important filter feeder in marine communities.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Bryozoan	{"Hard Substrates","Fouling Communities","Colony Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
481	Fanworm	Sabella spallanzanii	Large tube worm with spectacular feathery feeding crown. Filter feeds on plankton and detritus.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Soft Sediment","Tube Gardens","Filter Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
482	Feather Duster Worm	Bispira brunnea	Polychaete worm with colorful feeding plumes that snap shut when threatened.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Rocky Areas","Tube Communities","Plume Feeding"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
483	Acorn Worm	Balanoglossus clavigerus	Primitive deuterostome worm that lives in U-shaped burrows in sediment.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Soft Sediment","Burrow Systems","Deposit Feeding Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
484	Beard Worm	Siboglinum poseidoni	Deep-sea worm without digestive system that relies on chemosynthetic bacteria for nutrition.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Deep Sea Vents","Chemosynthetic Areas","Bacterial Partnerships"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
485	Ragworm	Nereis virens	Large polychaete worm with powerful jaws. Important prey species and sediment processor.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Muddy Sediment",Burrows,"Deposit Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
486	Scale Worm	Harmothoe imbricata	Polychaete worm with overlapping scales that provide protection from predators.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Rocky Areas","Under Rocks","Protected Positions"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
487	Peanut Worm	Sipunculus nudus	Unsegmented worm that can retract completely into its body. Important bioturbator.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Soft Sediment","Burrow Systems","Bioturbation Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
488	Ribbon Worm	Cerebratulus lacteus	Long nemertean worm with eversible proboscis for capturing prey.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Soft Sediment","Under Rocks","Predatory Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
489	Horsehair Worm	Gordius aquaticus	Parasitic worm that manipulates host behavior to reach water for reproduction.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{Freshwater,"Host Organisms","Parasitic Lifecycle"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
490	Flatworm	Pseudobiceros bedfordi	Colorful free-living flatworm with remarkable regeneration abilities.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Rocky Areas","Under Rocks","Regeneration Zones"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
491	Polyclad Flatworm	Pseudoceros dimidiatus	Marine flatworm with intricate patterns and excellent regeneration capabilities.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Coral Reefs","Under Ledges","Pattern Display Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
492	Arrow Worm	Sagitta elegans	Transparent planktonic predator with powerful grasping spines for catching prey.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Chaetognath	{"Open Waters","Planktonic Zone","Predatory Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
493	Priapulid Worm	Priapulus caudatus	Ancient marine worm with eversible pharynx. Living fossil from Cambrian period.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Soft Sediment","Cold Waters","Ancient Lineage"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
494	Spoon Worm	Urechis caupo	Fat innkeeper worm that shares burrows with other species. Important ecosystem engineer.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Worm	{"Shared Burrows",Mudflats,"Engineering Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
495	Kinorhynch	Echinoderes horni	Microscopic segmented worm that lives between sand grains. Important meiofauna component.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Kinorhynch	{"Between Sand Grains","Interstitial Spaces","Microscopic Habitats"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
496	Gastrotrich	Chaetonotus maximus	Microscopic aquatic animal with distinctive scales and adhesive tubes.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Gastrotrich	{"Between Sediment Grains",Biofilm,"Microscopic Communities"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
497	Rotifer	Brachionus plicatilis	Microscopic filter feeder with rotating wheel of cilia. Important in aquatic food webs.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Rotifer	{Planktonic,"All Aquatic Environments","Filter Communities"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
498	Nematode	Caenorhabditis elegans	Model organism roundworm found in marine sediments. Important in scientific research.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Nematode	{Sediment,"Decomposing Material","Research Labs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
499	Water Bear	Echiniscus testudo	Tardigrade capable of surviving extreme conditions including space. Found in marine environments.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Tardigrade	{Sediment,Biofilm,"Extreme Survival Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
500	Foraminifera	Globigerina bulloides	Single-celled organism with calcium carbonate shell. Important in ocean sediment formation.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Protozoa	{Planktonic,"Sediment Formation","All Oceans"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
501	Coccolithophore	Emiliania huxleyi	Single-celled algae with intricate calcium carbonate plates. Major contributor to marine carbon cycle.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Phytoplankton	{"Surface Waters","Photic Zone","Carbon Cycle Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
502	Red Algae	Corallina officinalis	Calcified algae that helps build reef structures. Important in calcium carbonate production.	https://images.unsplash.com/photo-1569003339405-ea396a5a8b90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Algae	{"Rocky Shores","Reef Building","Calcification Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
503	Brown Algae	Fucus vesiculosus	Intertidal seaweed with air bladders for buoyancy. Important habitat former in rocky shores.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Algae	{"Rocky Intertidal","Air Bladder Zones","Habitat Formation"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
504	Green Algae	Ulva lactuca	Sheet-like sea lettuce that can form large mats. Important primary producer and food source.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Algae	{"Shallow Waters","Nutrient Rich Areas","Primary Production"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
506	Hooded Seal	Cystophora cristata	Males have an inflatable nasal sac that resembles a red balloon when inflated during mating displays. These seals are incredible divers - they can dive deeper than 1,000 meters and stay underwater for over an hour! Fun fact: Baby hooded seals have the shortest nursing period of any mammal - just 4 days!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Marine Mammal	{"North Atlantic","Pack Ice","Deep Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
507	Grey Seal	Halichoerus grypus	Large seal with a distinctive horse-like head profile. Males can weigh up to 300kg and are much larger than females. They have excellent underwater vision and can see in very low light conditions. Fun fact: Their scientific name means "hooked-nosed sea pig"!	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"North Atlantic","Rocky Coasts","Sandy Beaches"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
508	Ribbon Seal	Histriophoca fasciata	Distinctive seal with beautiful contrasting bands of light and dark fur. Males develop striking white ribbons on a dark background. They spend most of their time in open ocean, rarely coming to shore. Fun fact: They are excellent swimmers and can dive to depths of 200 meters!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"North Pacific","Pack Ice","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
511	Caspian Seal	Pusa caspica	Endemic to the Caspian Sea, this small seal is found nowhere else on Earth. They are excellent divers and feed mainly on fish and crustaceans. Unfortunately, they are critically endangered due to habitat loss and pollution. Fun fact: They can rotate their rear flippers forward to help them move on land!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Marine Mammal	{"Caspian Sea","Brackish Water","Shallow Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
512	Spotted Seal	Phoca largha	Medium-sized seal with distinctive spotted patterns that vary between individuals. They are excellent swimmers and can dive to depths of 300 meters. Unlike many seals, they give birth on floating ice rather than land. Fun fact: Each seal has unique spot patterns, like fingerprints!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"North Pacific","Sea Ice","Coastal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
513	Baikal Seal	Pusa sibirica	The worlds only exclusively freshwater seal, found only in Lake Baikal in Russia. They have incredibly dense fur to survive the frigid waters. These seals can dive to amazing depths of 400 meters in the lake. Fun fact: They are the smallest true seal species and can live up to 56 years!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Lake Baikal",Freshwater,"Deep Lake"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
515	Leopard Seal	Hydrurga leptonyx	Antarctic apex predator with a distinctive spotted pattern and massive head. They are the only seal that regularly hunts warm-blooded prey including penguins and other seals. Can grow up to 3.5 meters long and weigh 600kg. Fun fact: They have been observed "playing" with penguins before eating them!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Antarctic Waters","Pack Ice","Sub-Antarctic Islands"}	{"🦎 Distinctive spotted pattern and massive head make them apex Antarctic predators","🐧 Only seal species that regularly hunts warm-blooded prey like penguins","🎯 Have been observed \\"playing\\" with penguins before eating them","📏 Can grow up to 3.5 meters long and weigh up to 600kg","🦈 Powerful jaws with sharp teeth designed for hunting marine mammals","🧊 Solitary hunters that patrol Antarctic ice edges"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
510	Ringed Seal	Pusa hispida	Smallest Arctic seal, easily identified by distinctive ring patterns on their fur. They are the only seal that can maintain breathing holes in solid ice by using their claws. These seals are crucial prey for polar bears. Fun fact: They can live up to 45 years and create snow caves for their pups!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Arctic Ocean","Sea Ice","Freshwater Lakes"}	{"💍 Distinctive ring patterns on their fur make each individual unique","🏠 Only seal species that can maintain breathing holes in solid ice using their claws","🐻 Primary prey species for polar bears - crucial Arctic food chain link","🏔️ Create snow caves above breathing holes to protect their pups","⏳ Can live up to 45 years in the harsh Arctic environment","🦭 Smallest Arctic seal species, perfectly adapted to sea ice life"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
525	South American Sea Lion	Otaria flavescens	Intelligent and social sea lion with males having a distinctive mane. They are excellent swimmers and can dive to depths of 175 meters. They are highly trainable and were historically used in circuses. Fun fact: They can sleep while floating vertically in the water!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"South American Coasts","Rocky Shores","Coastal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
526	New Zealand Sea Lion	Phocarctos hookeri	Rarest sea lion species in the world with only about 12,000 individuals remaining. They are excellent divers and can reach depths of over 600 meters. Females can stay underwater for up to 11 minutes. Fun fact: They are the only sea lion that breeds on the New Zealand mainland!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Marine Mammal	{"New Zealand Waters","Sandy Beaches","Subantarctic Islands"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
519	Northern Elephant Seal	Mirounga angustirostris	Large seal with males having a distinctive inflatable proboscis. They undertake epic migrations of up to 20,000 km annually - one of the longest migrations of any mammal. They are incredible deep divers, reaching depths of over 1,500 meters. Fun fact: They molt their entire skin and fur in one piece annually!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"North Pacific","Deep Ocean","Sandy Beaches"}	{"👃 Males have distinctive inflatable proboscis that amplifies their calls","🗺️ Undertake epic migrations up to 20,000 km annually","🏊 Can dive to depths over 1,500 meters hunting for squid","🐍 Molt their entire skin and fur in one piece annually","📏 Males can be 6 times heavier than females","🌊 Spend 90% of their lives in the open ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
527	California Sea Lion	Zalophus californianus	Highly intelligent and playful sea lion famous for their acrobatic abilities. They are excellent swimmers and can reach speeds of 40 km/h underwater. They can dive to depths of 300 meters and are commonly seen in marine parks. Fun fact: They are the sea lions most commonly seen in movies and shows due to their trainability!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"California Coast","Rocky Shores","Coastal Waters"}	{"🎪 Most trainable pinnipeds - commonly seen in marine shows","🏊 Can reach swimming speeds of 40 km/h underwater","🤸 Famous for acrobatic abilities and playful behavior","🏊 Can dive to depths of 300 meters hunting for fish","🧠 Highly intelligent with excellent problem-solving abilities","🎬 Most commonly featured sea lions in movies and TV shows"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
523	Steller Sea Lion	Eumetopias jubatus	Largest sea lion species with males weighing up to 1,000kg. They have external ear flaps and can rotate their rear flippers forward to "walk" on land. They are excellent swimmers and can dive to depths of 400 meters. Fun fact: They are incredibly vocal and can be heard roaring from over a kilometer away!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Marine Mammal	{"North Pacific","Rocky Coasts","Open Ocean"}	{"🏆 Largest sea lion species with males weighing up to 1,000kg","🗣️ Incredibly vocal - can be heard roaring from over 1km away","🏊 Can dive to depths of 400 meters hunting for fish","🦶 Can rotate rear flippers forward to \\"walk\\" on land","👂 Have external ear flaps unlike true seals","🌊 Found throughout the North Pacific Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
529	Antarctic Fur Seal	Arctocephalus gazella	Highly successful fur seal that has recovered from near extinction. They have incredibly dense fur with up to 300,000 hairs per square inch! They are excellent swimmers and can dive to depths of 200 meters. Fun fact: They can rotate their hind flippers forward to help them climb steep rocky shores!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Sub-Antarctic Islands","Rocky Shores","Cold Ocean Waters"}	{"🧥 Incredibly dense fur with up to 300,000 hairs per square inch","🏔️ Can rotate hind flippers forward to climb steep rocky shores","🔄 Made amazing recovery from near extinction due to hunting","🏊 Can dive to depths of 200 meters hunting for krill and fish","🧊 Highly successful in sub-Antarctic island environments","👥 Form massive breeding colonies during summer months"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
520	Ross Seal	Ommatophoca rossii	Rarest and least known Antarctic seal with distinctive large eyes and short snout. They have the thickest fur of any seal and can make unique vocalizations. They prefer heavy pack ice and are excellent divers. Fun fact: They are the only seal that can make trilling sounds like a bird!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Antarctic Waters","Heavy Pack Ice","Deep Ocean"}	{"👁️ Have the largest eyes of any seal species","🎵 Only seal that can make trilling sounds like a bird","🧥 Have the thickest fur of any seal for Antarctic survival","🏊 Excellent divers in heavy Antarctic pack ice","🔍 Rarest and least known Antarctic seal species","🎭 Distinctive large eyes and short snout make them unique"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
522	Hawaiian Monk Seal	Neomonachus schauinslandi	Critically endangered seal found only in Hawaiian waters. They are excellent divers and can stay underwater for up to 20 minutes. They prefer sandy beaches and coral reefs. Only about 1,400 individuals remain. Fun fact: They are the only native land mammal to Hawaii!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Marine Mammal	{"Hawaiian Waters","Coral Reefs","Sandy Beaches"}	{"🏝️ Only native land mammal to Hawaii","🚨 Critically endangered with only about 1,400 individuals remaining","⏰ Can stay underwater for up to 20 minutes while hunting","🏖️ Prefer sandy beaches and coral reef environments","🌺 Endemic to Hawaiian waters and found nowhere else","👥 Very important cultural species to Native Hawaiians"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
555	Coral Trout	Plectropomus leopardus	Large predatory fish with distinctive spotted pattern. Common around coral bommies and reef structures.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Coral Bommies","Reef Drop-offs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
556	Anemonefish	Amphiprion ocellaris	Small orange fish with white stripes living in symbiosis with sea anemones. Also known as clownfish.	https://images.unsplash.com/photo-1576806021995-9f68eb39f10b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Anemone Gardens","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
530	South American Fur Seal	Arctocephalus australis	Robust fur seal with males having a distinctive sagittal crest on their heads. They are excellent divers and can reach depths of 170 meters. They feed mainly on fish and squid. Fun fact: They have been observed using tools, such as rocks, to crack open shellfish!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"South American Coasts","Rocky Islands","Coastal Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
532	Subantarctic Fur Seal	Arctocephalus tropicalis	Distinctive fur seal with a prominent crest and orange-colored fur on the chest. They are excellent swimmers and can dive to depths of 208 meters. They have a unique feeding strategy of following fishing boats. Fun fact: They are the only fur seal found on tropical islands!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Subantarctic Islands","Tropical Islands","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
534	Juan Fernández Fur Seal	Arctocephalus philippii	Critically endangered fur seal found only on Juan Fernández Islands off Chile. They were hunted to near extinction but have slowly recovered. They are excellent swimmers and can dive to depths of 150 meters. Fun fact: They are one of the rarest pinnipeds in the world with only about 80,000 individuals!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Marine Mammal	{"Juan Fernández Islands","Rocky Coasts","Temperate Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
536	Brown Fur Seal	Arctocephalus pusillus	Largest fur seal species with males weighing up to 360kg. They have thick, coarse fur and are excellent swimmers. They can dive to depths of 200 meters and are very social animals. Fun fact: They are also known as Cape fur seals and can live up to 25 years!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Southern African Coasts","Australian Coasts","Rocky Shores"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
524	Australian Sea Lion	Neophoca cinerea	Playful sea lion endemic to Australia with a distinctive chocolate-brown coloration. They are excellent swimmers and can dive to depths of 230 meters. They have an unusually long breeding cycle of 17-18 months. Fun fact: They are the only sea lion that breeds year-round rather than seasonally!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Marine Mammal	{"Southern Australian Waters","Rocky Islands","Sandy Beaches"}	{"🌏 Only pinniped species endemic to Australia, found exclusively along southern and western coastlines","📉 Endangered with only around 12,000 individuals remaining worldwide","🍼 Longest breeding cycle among marine mammals - 17.6 months gestation plus 18 months nursing","🏠 Females show strong site fidelity, returning to birthplace to breed","🐾 Males are 3x larger than females and have distinctive yellowish manes","🍽️ Dive up to 150 meters hunting fish, squid, octopus, and even small sharks","🗣️ Use unique vocal cues for mother-pup recognition in crowded colonies","🦴 Their nutrient-rich feces support marine ecosystems by promoting phytoplankton growth"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
505	Bearded Seal	Erignathus barbatus	Large Arctic seal with distinctive long whiskers that can grow up to 12 inches long. They use their sensitive whiskers to find food like clams and crabs on the ocean floor. Fun fact: They can dive up to 500 meters deep and hold their breath for 20 minutes!	https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Arctic Ocean","Sea Ice","Shallow Waters"}	{"🧔 Distinctive whiskers can grow up to 12 inches long for finding food on the ocean floor","🏊 Can dive up to 500 meters deep and hold their breath for 20 minutes","🦐 Use sensitive whiskers to locate clams and crabs in murky Arctic waters","🧊 Essential Arctic species adapted to life on sea ice","📏 Can grow up to 2.5 meters long and weigh up to 450kg","🎣 Important subsistence hunting species for Indigenous communities"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
537	Northern Fur Seal	Callorhinus ursinus	Highly migratory fur seal that travels thousands of kilometers annually. They have incredibly dense fur and are excellent swimmers. They can dive to depths of 200 meters and spend most of their lives at sea. Fun fact: They have the densest fur of any mammal with up to 300,000 hairs per square inch!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Marine Mammal	{"North Pacific","Open Ocean","Breeding Islands"}	{"🧥 Densest fur of any mammal - up to 300,000 hairs per square inch","🗺️ Highly migratory, traveling thousands of kilometers annually","🏊 Can dive to depths of 200 meters hunting for fish and squid","🌊 Spend most of their lives in the open ocean","❄️ Incredibly thick fur provides insulation in cold waters","📊 Population has declined significantly due to commercial hunting"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
533	Guadalupe Fur Seal	Arctocephalus townsendi	Rare fur seal that was thought to be extinct until a small population was rediscovered in 1954. They are excellent swimmers and can dive to depths of 200 meters. They have very dense fur and pointed snouts. Fun fact: They have made an amazing comeback from just 14 individuals to over 40,000 today!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Marine Mammal	{"Guadalupe Island","California Coast","Rocky Shores"}	{"🔄 Amazing comeback from just 14 individuals to over 40,000 today","💀 Was thought extinct until rediscovered in 1954","🏊 Can dive to depths of 200 meters hunting for fish","🦭 Very dense fur and distinctive pointed snouts","🏝️ Endemic to Guadalupe Island off California","🌟 One of the greatest conservation success stories"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
514	Harbor Seal	Phoca vitulina	Most common seal in many coastal areas, easily recognized by their dog-like faces and curious nature. They are excellent swimmers and can sleep underwater! They can dive up to 500 meters deep and hold their breath for 30 minutes. Fun fact: Pups can swim within hours of being born!	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Coastal Waters",Estuaries,Harbors,"Rocky Shores"}	{"🐕 Dog-like faces make them easily recognizable and endearing to humans","😴 Can sleep underwater by floating vertically and coming up to breathe unconsciously","🏊 Excellent swimmers capable of diving up to 500 meters deep","⏰ Can hold their breath for up to 30 minutes while hunting","👶 Pups can swim within hours of being born","🏖️ Most common seal species in many coastal areas worldwide"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
509	Harp Seal	Pagophilus groenlandicus	Famous for their adorable white fluffy pups with big black eyes. Adults have distinctive harp-shaped markings on their backs. They undertake one of the longest migrations of any seal, traveling up to 8,000 km annually! Fun fact: Baby harp seals are born with yellow fur that turns white within days!	https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"North Atlantic","Arctic Ocean","Pack Ice"}	{"👶 Famous for adorable white fluffy pups with big black eyes","🌈 Baby seals are born yellow, turn white within days, then develop adult coloration","🎭 Adults have distinctive harp-shaped dark markings on their backs","🗺️ Undertake one of the longest migrations of any seal - up to 8,000 km annually","🧊 Expert ice navigators that follow the Arctic ice edge seasonally","🏊 Strong swimmers that can dive up to 300 meters deep"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
538	Walrus	Odobenus rosmarus	Massive Arctic marine mammal with distinctive tusks that can grow up to 1 meter long. They use their tusks for hauling out of water, breaking ice, and defense. They are social animals and can weigh up to 1,700kg. Fun fact: They can sleep while floating vertically in the water and can slow their heart rate to survive in frigid waters!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Marine Mammal	{"Arctic Ocean","Sea Ice","Rocky Shores"}	{"🦴 Tusks can grow up to 1 meter long and are used for hauling out of water","🏋️ Can weigh up to 1,700kg - among the largest pinnipeds","😴 Can sleep while floating vertically in water","❄️ Can slow their heart rate to survive in frigid Arctic waters","🧊 Use tusks to break through ice and establish social dominance","👥 Highly social animals that gather in large herds on ice floes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
516	Weddell Seal	Leptonychotes weddellii	Antarctic seal famous for being the southernmost dwelling mammal. They can dive deeper than 700 meters and hold their breath for over 80 minutes - longer than any other seal! They use their teeth to keep breathing holes open in the ice. Fun fact: They can live under ice for their entire lives!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Antarctic Waters","Fast Ice","Deep Ocean"}	{"🌍 Southernmost dwelling mammal on Earth","🏊 Can dive deeper than 700 meters - deeper than most seals","⏰ Hold their breath for over 80 minutes - longer than any other seal","🦷 Use their teeth to keep breathing holes open in Antarctic ice","🧊 Can live their entire lives under ice in Antarctica","🔍 Have excellent underwater vision adapted for dark depths"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
518	Southern Elephant Seal	Mirounga leonina	Largest seal in the world! Males can weigh up to 4,000kg and are 6 times heavier than females. They have an inflatable trunk-like nose. They are phenomenal divers, reaching depths of over 2,000 meters. Fun fact: They spend 90% of their lives underwater and can hold their breath for 2 hours!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Sub-Antarctic Islands","Deep Ocean","Sandy Beaches"}	{"🏆 Largest seal species in the world","🏋️ Males can weigh up to 4,000kg - as much as a small car","🏊 Phenomenal divers reaching depths over 2,000 meters","⏰ Can hold their breath for up to 2 hours while hunting","🌊 Spend 90% of their lives underwater in the open ocean","👃 Males have inflatable trunk-like noses for territorial displays"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
528	Galápagos Sea Lion	Zalophus wollebaeki	Endemic to the Galápagos Islands, these playful sea lions are smaller than their California cousins. They are excellent swimmers and can dive to depths of 180 meters. They are very social and curious around humans. Fun fact: They are the only sea lion species that lives at the equator!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Marine Mammal	{"Galápagos Islands","Volcanic Shores","Tropical Waters"}	{"🌎 Only sea lion species that lives at the equator","🏝️ Endemic to the Galápagos Islands volcanic shores","🏊 Can dive to depths of 180 meters in tropical waters","👥 Very social and curious around humans","🌡️ Adapted to tropical climate unlike other sea lion species","⚠️ Endangered species facing threats from climate change"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
531	New Zealand Fur Seal	Arctocephalus forsteri	Agile fur seal with excellent climbing abilities, often seen on steep rocky cliffs. They have dense, dark fur and can dive to depths of 238 meters. They are very social and form large colonies. Fun fact: They are the only fur seal that regularly climbs trees to rest!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"New Zealand Waters","Rocky Cliffs","Coastal Forests"}	{"🌳 Only fur seal that regularly climbs trees to rest","🏔️ Excellent climbing abilities on steep rocky cliffs","🏊 Can dive to depths of 238 meters hunting for fish","🌿 Sometimes found resting in coastal forests","👥 Very social animals forming large coastal colonies","🎯 Agile hunters with excellent underwater maneuverability"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
535	Galápagos Fur Seal	Arctocephalus galapagoensis	Smallest fur seal species, endemic to the Galápagos Islands. They have adapted to the tropical climate and are active during cooler nighttime hours. They are excellent swimmers and can dive to depths of 100 meters. Fun fact: They are the only fur seal that lives in tropical waters year-round!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Marine Mammal	{"Galápagos Islands","Lava Shores","Tropical Waters"}	{"🌡️ Only fur seal living in tropical waters year-round","🦭 Smallest fur seal species, adapted to equatorial climate","🌙 Active during cooler nighttime hours to avoid heat","🏊 Can dive to depths of 100 meters in tropical waters","🏝️ Endemic to the Galápagos Islands lava shores","⚠️ Endangered due to climate change and El Niño events"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
517	Crabeater Seal	Lobodon carcinophaga	Most abundant seal in the world despite their misleading name - they dont eat crabs! They filter-feed on krill using specialized teeth. They can live up to 40 years and are incredibly agile swimmers. Fun fact: They actually eat krill, not crabs, and are the most numerous large mammal on Earth after humans!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Marine Mammal	{"Antarctic Waters","Pack Ice","Open Ocean"}	{"🦐 Despite their name, they actually eat krill, not crabs","🌍 Most numerous large mammal on Earth after humans","🦷 Have specialized teeth for filter-feeding on krill","🏊 Incredibly agile swimmers in Antarctic waters","⏳ Can live up to 40 years in the harsh Antarctic environment","🧊 Perfectly adapted to life on Antarctic pack ice"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
521	Mediterranean Monk Seal	Monachus monachus	One of the most endangered marine mammals in the world with fewer than 700 individuals remaining. They are excellent swimmers and can dive to depths of 250 meters. They prefer sea caves and secluded beaches. Fun fact: They are the only seal native to the Mediterranean Sea!	https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Marine Mammal	{"Mediterranean Sea","Sea Caves","Rocky Coasts"}	{"🌊 Only seal species native to the Mediterranean Sea","💀 One of the most endangered marine mammals with fewer than 700 individuals","🏊 Can dive to depths of 250 meters hunting for fish","🏖️ Prefer secluded sea caves and hidden beaches","🏛️ Have coexisted with humans for thousands of years","🚨 Critically endangered due to human activities"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
539	Clownfish	Amphiprioninae	Small, brightly colored fish known for their symbiotic relationship with sea anemones.	https://images.unsplash.com/photo-1576806021995-9f68eb39f10b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
540	Green Sea Turtle	Chelonia mydas	Large sea turtle with a heart-shaped shell and small head. Named for the green fat beneath its shell.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Reptile	{"Coral Reef","Seagrass Beds","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
541	Reef Shark	Carcharhinus melanopterus	Medium-sized shark easily identified by the black tips on its fins. Common around coral reefs.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Coral Reef","Shallow Reef","Reef Drop-offs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
542	Manta Ray	Mobula birostris	One of the largest rays with a wingspan reaching up to 7 meters. Known for their intelligence and graceful swimming.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Ray	{"Open Ocean","Reef Drop-offs","Cleaning Stations"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
543	Blue Groper	Achoerodus gouldii	Large blue fish commonly seen patrolling Western Australian reefs. Males develop a distinctive bright blue coloration.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef","Limestone Reef","Temperate Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
544	Western Blue Devil	Paraplesiops meleagris	Prefers caves and overhangs of reef systems. Has distinctive blue coloration with spotted patterns.	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef",Caves,Overhangs}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
545	Harlequin Fish	Othos dentex	Often spotted near reef edges. Known for their distinctive patterned appearance.	https://images.unsplash.com/photo-1566551329999-ece81cad59fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Reef Edges","Rocky Reef","Open Water"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
546	Dhufish	Glaucosoma hebraicum	Inhabits deeper sections of reefs and is naturally wary of divers. Prized by recreational fishers.	https://images.unsplash.com/photo-1574781330855-d0db3eb7e905?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Fish	{"Deep Reef","Rocky Reef","Continental Shelf"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
547	Buffalo Bream	Kyphosus cornelii	Seen grazing in groups across reef systems. Known for their schooling behavior.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef","Seagrass Beds","Open Water"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
548	Wobbegong Shark	Orectolobus spp.	Lies motionless during the day and becomes active at night. Master of camouflage on reef floors.	https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Rocky Reef","Sandy Bottom",Caves}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
549	Port Jackson Shark	Heterodontus portusjacksoni	Commonly encountered resting in sandy areas during the day. Has distinctive harness-like markings.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Sandy Bottom","Rocky Reef","Temperate Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
550	Western Rock Lobster	Panulirus cygnus	Found in abundance within reef crevices. Commercially important species in Western Australia.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Rocky Reef",Crevices,"Limestone Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
551	Scalyfin	Parma occidentalis	Defends its territory aggressively. Small but feisty fish common on Western Australian reefs.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef","Territorial Areas","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
552	Moon Wrasse	Thalassoma lunare	Adds vibrant color to the reefscape with its brilliant blue and green patterns.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Tropical Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
553	Angelfish	Pomacanthidae	Colorful reef fish with distinctive body shape and vibrant patterns. Common around coral formations.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Coral Bommies","Tropical Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
554	Butterflyfish	Chaetodontidae	Brightly colored fish with distinctive patterns. Often found in pairs around coral formations.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Coral Bommies","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
557	Nudibranch	Nudibranchia	Soft-bodied, marine gastropod mollusks known for their extraordinary colors and forms.	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Coral Reef","Rocky Reef","Macro Sites"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
558	Octopus	Octopoda	Intelligent cephalopod with eight arms and remarkable camouflage abilities.	https://images.unsplash.com/photo-1559616573-7755a48a70f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Coral Reef","Rocky Reef",Crevices}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
559	Sweetlips	Haemulidae	Large-lipped fish often found around coral formations and cleaning stations.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Cleaning Stations","Coral Bommies"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
560	Goby	Gobiidae	Small fish often found in symbiotic relationships with other marine animals.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Sandy Bottom","Cleaning Stations"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
561	Pipefish	Syngnathidae	Elongated fish related to seahorses, known for their excellent camouflage.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Seagrass Beds","Rocky Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
562	Whitetip Reef Shark	Triaenodon obesus	Small shark with distinctive white-tipped dorsal and tail fins. Common around coral reefs.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Coral Reef","Reef Drop-offs","Coral Bommies"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
563	Barracuda	Sphyraenidae	Large predatory fish with elongated body and fearsome teeth. Often found in schools.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Coral Reef","Reef Drop-offs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
564	Cleaner Wrasse	Labroides dimidiatus	Small fish that provides cleaning services to other marine species at cleaning stations.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Cleaning Stations","Coral Reef","Coral Bommies"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
565	Damselfish	Pomacentridae	Small, colorful fish that are highly territorial and abundant around coral reefs.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Coral Bommies","Territorial Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
566	Hawksbill Turtle	Eretmochelys imbricata	Critically endangered sea turtle with distinctive overlapping scutes and hawk-like beak.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Reptile	{"Coral Reef","Cleaning Stations","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
567	Loggerhead Turtle	Caretta caretta	Large sea turtle with a distinctive large head and powerful jaws.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Reptile	{"Open Ocean","Coral Reef","Cleaning Stations"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
568	Mackerel	Scombridae	Fast-swimming pelagic fish often found in schools around reef areas.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Reef Drop-offs","Pelagic Zone"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
569	Trevally	Carangidae	Large silvery fish known for their speed and schooling behavior around reefs.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Coral Reef","Reef Drop-offs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
570	Broadclub Cuttlefish	Sepia latimanus	Large cuttlefish with remarkable color-changing abilities and intelligence.	https://images.unsplash.com/photo-1559616573-7755a48a70f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Coral Reef","Sandy Bottom","Reef Edges"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
571	Clownfish	Amphiprioninae	Small, brightly colored fish known for their symbiotic relationship with sea anemones.	https://images.unsplash.com/photo-1576806021995-9f68eb39f10b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
572	Green Sea Turtle	Chelonia mydas	Large sea turtle with a heart-shaped shell and small head. Named for the green fat beneath its shell.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Endangered	Reptile	{"Coral Reef","Seagrass Beds","Open Ocean"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
573	Reef Shark	Carcharhinus melanopterus	Medium-sized shark easily identified by the black tips on its fins. Common around coral reefs.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Coral Reef","Shallow Reef","Reef Drop-offs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
574	Manta Ray	Mobula birostris	One of the largest rays with a wingspan reaching up to 7 meters. Known for their intelligence and graceful swimming.	https://images.unsplash.com/photo-1547387657-e4e467c0870c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Ray	{"Open Ocean","Reef Drop-offs","Cleaning Stations"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
575	Blue Groper	Achoerodus gouldii	Large blue fish commonly seen patrolling Western Australian reefs. Males develop a distinctive bright blue coloration.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef","Limestone Reef","Temperate Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
576	Western Blue Devil	Paraplesiops meleagris	Prefers caves and overhangs of reef systems. Has distinctive blue coloration with spotted patterns.	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef",Caves,Overhangs}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
577	Harlequin Fish	Othos dentex	Often spotted near reef edges. Known for their distinctive patterned appearance.	https://images.unsplash.com/photo-1566551329999-ece81cad59fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Reef Edges","Rocky Reef","Open Water"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
578	Dhufish	Glaucosoma hebraicum	Inhabits deeper sections of reefs and is naturally wary of divers. Prized by recreational fishers.	https://images.unsplash.com/photo-1574781330855-d0db3eb7e905?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Fish	{"Deep Reef","Rocky Reef","Continental Shelf"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
579	Buffalo Bream	Kyphosus cornelii	Seen grazing in groups across reef systems. Known for their schooling behavior.	https://images.unsplash.com/photo-1571757767119-68b8dbed8c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef","Seagrass Beds","Open Water"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
580	Wobbegong Shark	Orectolobus spp.	Lies motionless during the day and becomes active at night. Master of camouflage on reef floors.	https://images.unsplash.com/photo-1593730979057-f14b12c6e0d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Rocky Reef","Sandy Bottom",Caves}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
581	Port Jackson Shark	Heterodontus portusjacksoni	Commonly encountered resting in sandy areas during the day. Has distinctive harness-like markings.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Shark	{"Sandy Bottom","Rocky Reef","Temperate Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
582	Western Rock Lobster	Panulirus cygnus	Found in abundance within reef crevices. Commercially important species in Western Australia.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"Rocky Reef",Crevices,"Limestone Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
583	Scalyfin	Parma occidentalis	Defends its territory aggressively. Small but feisty fish common on Western Australian reefs.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Rocky Reef","Territorial Areas","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
584	Moon Wrasse	Thalassoma lunare	Adds vibrant color to the reefscape with its brilliant blue and green patterns.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Tropical Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
585	Angelfish	Pomacanthidae	Colorful reef fish with distinctive body shape and vibrant patterns. Common around coral formations.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Coral Bommies","Tropical Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
586	Butterflyfish	Chaetodontidae	Brightly colored fish with distinctive patterns. Often found in pairs around coral formations.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Coral Bommies","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
587	Coral Trout	Plectropomus leopardus	Large predatory fish with distinctive spotted pattern. Common around coral bommies and reef structures.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Coral Bommies","Reef Drop-offs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
588	Anemonefish	Amphiprion ocellaris	Small orange fish with white stripes living in symbiosis with sea anemones. Also known as clownfish.	https://images.unsplash.com/photo-1576806021995-9f68eb39f10b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Anemone Gardens","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
589	Nudibranch	Nudibranchia	Soft-bodied, marine gastropod mollusks known for their extraordinary colors and forms.	https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Mollusk	{"Coral Reef","Rocky Reef","Macro Sites"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
590	Octopus	Octopoda	Intelligent cephalopod with eight arms and remarkable camouflage abilities.	https://images.unsplash.com/photo-1559616573-7755a48a70f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Coral Reef","Rocky Reef",Crevices}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
591	Sweetlips	Haemulidae	Large-lipped fish often found around coral formations and cleaning stations.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Cleaning Stations","Coral Bommies"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
592	Goby	Gobiidae	Small fish often found in symbiotic relationships with other marine animals.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Sandy Bottom","Cleaning Stations"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
593	Pipefish	Syngnathidae	Elongated fish related to seahorses, known for their excellent camouflage.	https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Seagrass Beds","Rocky Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
594	Whitetip Reef Shark	Triaenodon obesus	Small shark with distinctive white-tipped dorsal and tail fins. Common around coral reefs.	https://images.unsplash.com/photo-1560275619-4662e36fa65c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Near Threatened	Shark	{"Coral Reef","Reef Drop-offs","Coral Bommies"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
595	Barracuda	Sphyraenidae	Large predatory fish with elongated body and fearsome teeth. Often found in schools.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Coral Reef","Reef Drop-offs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
596	Cleaner Wrasse	Labroides dimidiatus	Small fish that provides cleaning services to other marine species at cleaning stations.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Cleaning Stations","Coral Reef","Coral Bommies"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
597	Damselfish	Pomacentridae	Small, colorful fish that are highly territorial and abundant around coral reefs.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Coral Bommies","Territorial Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
598	Hawksbill Turtle	Eretmochelys imbricata	Critically endangered sea turtle with distinctive overlapping scutes and hawk-like beak.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Critically Endangered	Reptile	{"Coral Reef","Cleaning Stations","Shallow Reef"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
599	Loggerhead Turtle	Caretta caretta	Large sea turtle with a distinctive large head and powerful jaws.	https://images.unsplash.com/photo-1568660357733-823cbddb0f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Vulnerable	Reptile	{"Open Ocean","Coral Reef","Cleaning Stations"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
600	Mackerel	Scombridae	Fast-swimming pelagic fish often found in schools around reef areas.	https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Reef Drop-offs","Pelagic Zone"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
601	Trevally	Carangidae	Large silvery fish known for their speed and schooling behavior around reefs.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Open Ocean","Coral Reef","Reef Drop-offs"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
602	Broadclub Cuttlefish	Sepia latimanus	Large cuttlefish with remarkable color-changing abilities and intelligence.	https://images.unsplash.com/photo-1559616573-7755a48a70f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cephalopod	{"Coral Reef","Sandy Bottom","Reef Edges"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
603	Jellyfish	Cnidaria	Gelatinous marine creatures with stinging tentacles, commonly found in river systems.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"River Environment","Brackish Waters",Estuaries}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
604	Hermit Crab	Paguridae	Small crustaceans that live in discarded shells, commonly found in riverine environments.	https://images.unsplash.com/photo-1559616573-7755a48a70f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"River Bottom","Sandy Bottom","Rocky Areas"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
605	Sea Anemone	Actiniaria	Colorful marine animals with tentacles that provide habitat for small fish and crustaceans.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Cnidarian	{"River Bottom","Rocky Crevices","Artificial Structures"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
606	Blue Crab	Callinectes sapidus	Blue-colored crab commonly found in estuarine and riverine environments.	https://images.unsplash.com/photo-1559616573-7755a48a70f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Crustacean	{"River Bottom",Estuaries,"Brackish Waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
607	Leatherjacket	Parika scaber	Small colorful fish commonly found around jetty pylons and artificial structures in Perth waters	\N	Least Concern	Fish	{"Jetty pylons","Artificial reefs"}	{"Leatherjackets are excellent cleaners, often nibbling algae off jetty pylons","They have tough, leather-like skin that protects them from rough surfaces"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
608	Pygmy Filefish	Monacanthus chinensis	Tiny filefish that hide among marine growth on artificial structures	\N	Least Concern	Fish	{"Artificial reefs","Jetty structures"}	{"These miniature fish are masters of camouflage","They can change color to match their surroundings"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
609	Crested Morwong	Cheilodactylus spectabilis	School-forming fish with distinctive crest-like dorsal fin common in Perth jetty dives	\N	Least Concern	Fish	{"Rocky reefs","Jetty structures"}	{"These social fish form large schools that can surround divers","They are curious and often approach divers closely"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
610	Stripey	Microcanthus strigatus	Small black and white striped fish abundant in Perth coastal waters	\N	Least Concern	Fish	{"Jetty structures","Rocky reefs"}	{"Their bold stripes help them blend with jetty pylon shadows","They form large schools for protection"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
611	Blue Swimmer Crab	Portunus armatus	Large swimming crab with blue-tinged claws common in Perth waters	\N	Least Concern	Crustacean	{"Sandy bottoms","Seagrass beds"}	{"These powerful swimmers can reach speeds of up to 25 km/h underwater","They use their paddle-like rear legs for rapid swimming"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
612	Wavy Grubfish	Parapercis haackei	Bottom-dwelling fish with wavy patterns common in Perth shallow waters	\N	Least Concern	Fish	{"Sandy bottoms","Shallow reefs"}	{"These ambush predators bury themselves in sand","Only their eyes show while waiting for prey to pass by"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
613	Scalyfin	Parma unifasciata	Schooling fish with distinctive scaled fins found around Perth jetties	\N	Least Concern	Fish	{"Jetty structures","Rocky reefs"}	{"Form large schools around artificial structures","Their scales create a shimmering effect underwater"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
615	Cardinalfish	Apogon rueppellii	Small red fish found around Perth dive sites	\N	Least Concern	Fish	{"Jetty structures","Rocky crevices"}	{"Males carry eggs in their mouths until they hatch","They are more active during night dives"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
616	Catfish	Cnidoglanis macrocephalus	Bottom-dwelling fish with whisker-like barbels found in Perth waters	\N	Least Concern	Fish	{"Sandy bottoms","Jetty structures"}	{"They use their barbels to feel for food in murky water","Can deliver a painful sting with their dorsal fin spines"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
618	Striped Catfish	Plotosus lineatus	Distinctive black and white striped fish that form tight schools around jetty pylons. Juveniles are particularly common in shallow waters.	https://images.unsplash.com/photo-1571752726703-5e7d1f9bd2d2?w=800&h=600&fit=crop	Least Concern	Fish	{"Artificial Reef","Sandy Bottom","Jetty Structure"}	{"Form dense, ball-shaped schools when threatened","Have venomous spines - handle with care","Young fish have more prominent stripes"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
614	Bullseye	Pempheris klunzingeri	Silvery schooling fish with large eyes common in Perth waters	\N	Least Concern	Fish	{"Artificial Reef","Jetty Structure"}	{"Their large eyes help them see in low light conditions","They form dense schools under jetty structures"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
617	Herring	Sardinops sagax	Small schooling fish commonly found around jetty structures. Forms large schools and is an important food source for larger marine predators.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1074&auto=format&fit=crop	\N	Fish	{"Open Water","Jetty Structure"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	Nudibranch	Chromodoris spp.	Colorful sea slugs with intricate body forms and feeding appendages	https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop	Least Concern	Mollusk	{"Rocky Reef","Artificial Structure"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
163	Soft Coral	Dendronephthya klunzingeri	Colorful branching coral without hard skeleton. Feeds by filtering plankton from water current.	https://images.unsplash.com/photo-1570481947811-ef44b2e4b18a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Coral	{"Jetty Structure","Hard Bottom"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
619	Small Schooling Fish	Various species	A variety of small fish species that form schools around jetty structures, including juvenile fish and baitfish species common in shallow coastal waters.	https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop	Least Concern	Fish	{"Open Water","Artificial Reef","Jetty Structure"}	{"Safety in numbers - schooling provides protection","Often seen in large, shimmering groups","Important food source for larger predators"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
620	Morwong	Cheilodactylus spp.	\N	\N	LC	Fish	\N	{"🐟 Can live up to 30 years in the wild","🎨 Juveniles have completely different coloration than adults","🏊 Use their elongated pectoral fins to \\"walk\\" along the bottom","🌙 Most active during twilight hours (crepuscular)","🦀 Feed mainly on small crustaceans and mollusks"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
621	Samson Fish	Seriola hippos	\N	\N	LC	Fish	\N	{"🐟 Can grow up to 1.8m in length and weigh up to 60kg","💪 Powerful swimmers known for their fighting ability","🌊 Found in open waters near reefs and wrecks","🍽️ Prized as a food fish and popular with anglers","🏊 Often found in schools around structures"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
622	Razor Clam	Ensis spp.	Razor clams are elongated bivalve mollusks with distinctive razor-shaped shells. They burrow vertically in sandy substrates and are excellent diggers.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Mollusks	{"Sandy beaches and intertidal zones"}	{"⚡ Can burrow into sand at speeds up to 20cm per second","🔪 Shell shape inspired their common name due to resemblance to old-fashioned straight razors","🌊 Extend siphons to filter feed while buried in sand"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
623	Red-lipped Morwong	Cheilodactylus rubrolabiatus	Red-lipped Morwong are distinctive fish with prominent red lips and silver-grey bodies. They are endemic to Western Australian waters.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Fish	{"Rocky reefs and kelp forests"}	{"💋 Their bright red lips make them instantly recognizable underwater","🏡 Endemic to Western Australia, found nowhere else in the world","🎯 Use their thick lips to pick invertebrates from crevices"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
624	Moonlighter	Tilodon sexfasciatus	Moonlighters are schooling fish with silvery bodies and distinctive vertical bars. They are common in shallow coastal waters.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Fish	{"Rocky reefs, jetties, and coastal waters"}	{"🌙 Named for their silvery appearance that shimmers like moonlight","👥 Form large schools around jetties and reef structures","🎭 Can rapidly change color intensity when stressed or excited"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
625	Buff Bream	Rhabdosargus sarba	Buff Bream are silvery fish with a yellowish tinge. They are common in estuaries and coastal waters.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Fish	{"Estuaries, harbors, and coastal reefs"}	{"🏖️ Often found in shallow sandy areas near jetties","🦷 Have strong teeth for crushing shellfish and crustaceans","🌅 Most active during dawn and dusk periods"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
626	White Mussel	Mytilus edulis planulatus	White Mussels are filter-feeding bivalves that attach to hard surfaces. They form dense colonies on jetty pylons and rocks.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Mollusks	{"Intertidal zones, jetty pylons, and rocky shores"}	{"🔗 Attach to surfaces using strong protein threads called byssus","💧 Can filter up to 65 liters of water per day","🏘️ Form dense colonies that provide habitat for other species"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
627	Staircase Sponge	Phakellia spp.	Staircase Sponges have distinctive fan-shaped growth patterns resembling steps. They are filter feeders found on reefs.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Other Invertebrates	{"Rocky reefs and caves"}	{"🏗️ Growth pattern resembles a spiral staircase","🦠 Host to numerous microscopic organisms in their pores","🎨 Often bright orange or yellow in color"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
628	Egg Urchin	Tripneustes gratilla	Egg Urchins are round sea urchins with short spines. They often cover themselves with debris for camouflage.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Echinoderms	{"Seagrass beds and shallow reefs"}	{"🥚 Round shape resembles an egg, hence the common name","🎭 Decorate themselves with shells, seaweed, and debris for camouflage","🌱 Important grazers that help control algae growth"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
629	Banded Sweep	Scorpis georgiana	Banded Sweep are schooling fish with distinctive dark vertical bands. They are common around rocky reefs and jetties in southern Australian waters.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Fish	{"Rocky reefs",Jetties,"Coastal waters"}	{"🎭 Named for their distinctive dark bands across silver bodies","👥 Form large schools around reef structures","🏊 Active swimmers that constantly patrol reef edges"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
630	Sea Mullet	Mugil cephalus	Sea Mullet are coastal fish with streamlined bodies. They are important in both commercial fisheries and marine ecosystems.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Fish	{Estuaries,"Coastal waters","Sandy bottoms"}	{"🌊 Can live in both salt and freshwater environments","🍴 Important commercial and recreational fishing species","⚡ Fast swimmers that leap out of water when threatened"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
631	Tarwhine	Rhabdosargus sarba	Tarwhine are silvery fish similar to bream. They are common in estuaries and shallow coastal waters.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Fish	{Estuaries,"Seagrass beds","Shallow reefs"}	{"🐟 Often confused with other bream species","🌱 Feed on seagrass and small invertebrates","👥 Form schools in shallow coastal waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
632	Cushion Star	Patiriella calcar	Cushion Stars are small, colorful sea stars with a cushion-like appearance. They are common in rock pools and shallow reefs.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Echinoderms	{"Rock pools","Shallow reefs","Intertidal zones"}	{"⭐ Come in various bright colors including orange, purple, and green","🔄 Can regenerate lost arms over time","🦪 Feed on algae and small invertebrates"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
633	Crayfish	Panulirus cygnus	Western Rock Lobster, commonly called crayfish in WA, are spiny lobsters found along the west coast. They are an important commercial species and popular with divers.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Crustaceans	{"Rocky reefs","Caves and ledges","Kelp forests"}	{"🦞 Can live up to 20 years in the wild","🏃 Walk backwards when escaping predators","🌙 Most active at night when hunting"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
634	Grey Nurse Shark	Carcharias taurus	Grey Nurse Sharks are large, slow-moving sharks with a fearsome appearance but docile nature. They are critically endangered in Australian waters.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	CR	Sharks	{"Caves and gutters","Rocky reefs",Shipwrecks}	{"🦷 Has over 300 needle-sharp teeth but rarely attacks humans","⚠️ Critically endangered with less than 2000 left on east coast","💨 Gulps air at surface to maintain buoyancy"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
635	Old Wife	Enoplosus armatus	Old Wife are distinctive fish with black and white vertical stripes and venomous spines. They produce a grunting sound when caught, hence their common name.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Fish	{"Rocky reefs","Seagrass beds",Jetties}	{"🎵 Make grunting sounds like an old woman complaining","⚠️ Have venomous spines that can cause painful wounds","🦓 Striking black and white striped pattern"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
636	Brownfield's Wrasse	Halichoeres brownfieldi	Brownfield's Wrasse are colorful reef fish endemic to southern Australian waters. Males display vibrant colors during breeding season.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Fish	{"Rocky reefs","Kelp forests","Temperate waters"}	{"🎨 Males have bright blue and orange coloration","🏡 Endemic to southern Australian waters","🔄 Can change sex from female to male"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
637	Ascidian	Ascidiacea	Ascidians or sea squirts are filter-feeding tunicates that attach to hard surfaces. They come in various colors and forms, from solitary to colonial species.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Other Invertebrates	{"Rocky reefs","Jetty pylons","Artificial structures"}	{"💧 Filter up to 200 liters of water per day","🔄 Can regenerate lost body parts","🎨 Come in brilliant colors from blue to orange"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
638	WA Butterfish	Pentaceropsis recurvirostris	WA Butterfish are silvery fish with compressed bodies found around reefs and jetties. They are endemic to southern Australian waters.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Fish	{"Rocky reefs",Jetties,"Coastal waters"}	{"🏊 Strong swimmers that school in open water","🎣 Popular recreational fishing species","🌊 Endemic to southern Australian waters"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
639	Sea Star	Asteroidea	Sea stars are echinoderms with typically five arms radiating from a central disc. They are important predators in marine ecosystems.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Echinoderms	{"Rocky reefs","Sandy bottoms","Tidal pools"}	{"⭐ Can regenerate lost arms over months","🍴 Turn stomach inside out to digest prey","👁️ Have simple eyes at the end of each arm"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
640	Eel	Muraenidae	Eels are elongated fish that hide in crevices and caves during the day. Most species are nocturnal hunters with powerful jaws.	https://images.unsplash.com/photo-1559426756-14c161f0dae8?q=80&w=1074&auto=format&fit=crop	LC	Fish	{"Rocky crevices",Caves,"Reef holes"}	{"🌙 Most active at night when hunting","🦷 Have a second set of jaws in their throat","🏠 Often share burrows with cleaner shrimp"}	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
641	Blackspotted Tuskfish	Choerodon schoenleinii	Large tuskfish with black spot at base of dorsal fin. This impressive reef fish is known for its powerful jaws and distinctive markings, making it a favorite among divers exploring Western Australia's coral and rocky reefs.	https://images.unsplash.com/photo-1535591273668-578e31182c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80	Least Concern	Fish	{"Coral Reef","Rocky Reef","Tropical Waters"}	{"🐟 Blackspotted Tuskfish can change sex from female to male as they mature","💪 They have powerful crushing jaws that can crack open mollusks and crustaceans","🏠 Large males defend territories with multiple females in a harem-like social structure"}	Eukarya	Animalia	Chordata	Actinopterygii	Labriformes	Labridae	Choerodon	Gascoyne Coast Bioregion	{reef}	{"Ningaloo Reef",Dampier}	Year-round	[{"title": "Protogynous Hermaphrodite", "details": "This sex change is common among wrasses and tuskfishes (family Labridae) and helps balance reproduction in their social groups. One large male defends a territory with several females, and when he disappears, the largest female transforms to take his place.", "summary": "Is a protogynous sequential hermaphrodite - starts life as a female and later changes into a male, usually when it grows larger or when a dominant male is absent.", "subPoints": ["Sequential hermaphrodite: An organism that changes sex during its lifetime - starting as one sex and later becoming the other.", "Protandry: Starts as a male, later changes to female (e.g. clownfish).", "Protogyny: Starts as a female, later changes to male (e.g. many wrasses and parrotfish).", "This ability is usually triggered by social or environmental cues - like the absence of a dominant male or changes in population structure - and helps maximize reproductive success in different conditions."]}]	Discuss hermaphroditism in wrasses and parrotfishes.
\.


--
-- Data for Name: user_certifications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_certifications (id, user_id, certification_id, date_obtained, certification_number, created_at) FROM stdin;
\.


--
-- Data for Name: user_favorites; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_favorites (id, user_id, dive_site_id, date_added) FROM stdin;
\.


--
-- Data for Name: user_spotted_species; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_spotted_species (id, user_id, species_id, dive_site_id, date_spotted, photo_id, notes) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password, email, profile_picture, bio, country_id, name, lastname, preferred_activity, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: water_conditions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.water_conditions (id, dive_site_id, "timestamp", water_temp, visibility, current_strength, current_direction, wave_height, wind_speed, wind_direction, weather_conditions, surface_conditions, diving_conditions, reported_by, additional_notes) FROM stdin;
63	61	2025-07-10 08:19:36.239163	26	30	Light	Southeast	1.2	15	Northeast	Partly cloudy	Calm	Excellent	Marine Weather Station	Perfect conditions for diving. High visibility and calm seas.
64	62	2025-07-10 08:19:36.285774	24	45	Moderate	East	0.8	12	East	Sunny	Smooth	Excellent	Dive Center Belize	Crystal clear water with excellent visibility. Light current at depth.
65	63	2025-07-10 08:19:36.327788	28	25	Strong	Southwest	2.1	22	Southwest	Partly cloudy	Choppy	Good	Philippine Coast Guard	Strong currents present. Recommended for experienced divers only.
66	64	2025-07-10 08:19:36.36673	18	20	Light	West	1.2	16	Southwest	Partly cloudy	Calm	Good	WA Marine Parks	Excellent limestone formations with good visibility. Light current ideal for all skill levels.
67	65	2025-07-10 08:19:36.406559	19	15	Light to Moderate	Southwest	1.5	18	West	Clear	Slight chop	Good	Perth Diving Academy	Diverse marine ecosystem with kelp forest. Good visibility with moderate current suitable for intermediate divers.
68	66	2025-07-10 08:19:36.445121	26	25	Mild	Northeast	0.8	12	Southeast	Clear	Calm	Excellent	Great Barrier Reef Marine Park Authority	Excellent visibility with calm conditions. Perfect for exploring the twin coral bommies and photographing marine life.
69	67	2025-07-10 08:19:36.483898	26	20	Mild	Northeast	0.5	10	Southeast	Clear	Calm	Excellent	Great Barrier Reef Marine Park Authority	Ideal conditions for beginners. Excellent turtle sighting opportunities at the cleaning stations.
70	68	2025-07-10 08:19:36.522472	19	12	Minimal	North	0.3	8	Southwest	Partly cloudy	Calm	Good	WA Marine Parks	Excellent shore dive conditions. Artificial reef structure provides good shelter and marine life opportunities.
71	69	2025-07-10 08:19:36.561121	18	8	Minimal	West	0.1	5	Southeast	Clear	Calm	Good	Swan River Trust	Calm riverine conditions ideal for exploring unique freshwater marine ecosystems and wreck structures.
72	103	2025-08-02 05:28:39.309706	21	12	Light	\N	0.5	\N	\N	Sunny	Calm	Good	Manual	Morning conditions are optimal with minimal surge and good visibility. Best diving time in calm weather.
73	97	2025-08-02 06:19:09.788943	21	5	None	N	0.3	8	E	Sunny	Calm	Good	Manual	Shallow wreck site with paddle grass, visibility can drop when silty bottom is disturbed
74	98	2025-08-02 06:19:11.513587	21	8	Mild	SE	0.5	12	SE	Partly Cloudy	Choppy	Good	Manual	Sheltered site excellent during poor weather, watch for boat traffic and fishing activities
\.


--
-- Name: category_badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.category_badges_id_seq', 1, false);


--
-- Name: certifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.certifications_id_seq', 49, true);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.countries_id_seq', 20, true);


--
-- Name: dive_centers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dive_centers_id_seq', 12, true);


--
-- Name: dive_log_species_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dive_log_species_id_seq', 1, false);


--
-- Name: dive_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dive_logs_id_seq', 1, false);


--
-- Name: dive_maps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dive_maps_id_seq', 1, false);


--
-- Name: dive_site_species_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dive_site_species_id_seq', 296, true);


--
-- Name: dive_sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.dive_sites_id_seq', 114, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.events_id_seq', 1, false);


--
-- Name: lesson_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.lesson_progress_id_seq', 1, false);


--
-- Name: nearby_dive_sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.nearby_dive_sites_id_seq', 8, true);


--
-- Name: photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.photos_id_seq', 1, false);


--
-- Name: post_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.post_comments_id_seq', 1, false);


--
-- Name: post_likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.post_likes_id_seq', 1, false);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.posts_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: species_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.species_id_seq', 641, true);


--
-- Name: user_certifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_certifications_id_seq', 1, false);


--
-- Name: user_favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_favorites_id_seq', 1, false);


--
-- Name: user_spotted_species_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_spotted_species_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: water_conditions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.water_conditions_id_seq', 74, true);


--
-- Name: category_badges category_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.category_badges
    ADD CONSTRAINT category_badges_pkey PRIMARY KEY (id);


--
-- Name: category_badges category_badges_user_id_category_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.category_badges
    ADD CONSTRAINT category_badges_user_id_category_key UNIQUE (user_id, category);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: countries countries_code_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_code_key UNIQUE (code);


--
-- Name: countries countries_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_name_key UNIQUE (name);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: dive_centers dive_centers_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_centers
    ADD CONSTRAINT dive_centers_pkey PRIMARY KEY (id);


--
-- Name: dive_log_species dive_log_species_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_log_species
    ADD CONSTRAINT dive_log_species_pkey PRIMARY KEY (id);


--
-- Name: dive_logs dive_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_logs
    ADD CONSTRAINT dive_logs_pkey PRIMARY KEY (id);


--
-- Name: dive_maps dive_maps_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_maps
    ADD CONSTRAINT dive_maps_pkey PRIMARY KEY (id);


--
-- Name: dive_site_species dive_site_species_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_site_species
    ADD CONSTRAINT dive_site_species_pkey PRIMARY KEY (id);


--
-- Name: dive_sites dive_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dive_sites
    ADD CONSTRAINT dive_sites_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: lesson_progress lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_pkey PRIMARY KEY (id);


--
-- Name: lesson_progress lesson_progress_user_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id);


--
-- Name: nearby_dive_sites nearby_dive_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.nearby_dive_sites
    ADD CONSTRAINT nearby_dive_sites_pkey PRIMARY KEY (id);


--
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);


--
-- Name: post_comments post_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_pkey PRIMARY KEY (id);


--
-- Name: post_likes post_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_pkey PRIMARY KEY (id);


--
-- Name: post_likes post_likes_user_id_post_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_user_id_post_id_key UNIQUE (user_id, post_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: species species_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT species_pkey PRIMARY KEY (id);


--
-- Name: user_certifications user_certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_certifications
    ADD CONSTRAINT user_certifications_pkey PRIMARY KEY (id);


--
-- Name: user_certifications user_certifications_user_id_certification_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_certifications
    ADD CONSTRAINT user_certifications_user_id_certification_id_key UNIQUE (user_id, certification_id);


--
-- Name: user_favorites user_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_pkey PRIMARY KEY (id);


--
-- Name: user_spotted_species user_spotted_species_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_spotted_species
    ADD CONSTRAINT user_spotted_species_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: water_conditions water_conditions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.water_conditions
    ADD CONSTRAINT water_conditions_pkey PRIMARY KEY (id);


--
-- Name: water_conditions water_conditions_dive_site_id_dive_sites_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.water_conditions
    ADD CONSTRAINT water_conditions_dive_site_id_dive_sites_id_fk FOREIGN KEY (dive_site_id) REFERENCES public.dive_sites(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict qjLV7IZA14HLceZxKv9JHfTAKBUuLjW865jab4hd3WtzKrexuy3osY76cVlQuf4

