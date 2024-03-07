CREATE TABLE major_city (
    composite character varying(1024),
    city_name character varying(1024),
    city_longitude numeric,
    city_latitude numeric,
    country_code character varying(3),
    province character varying(1024),
    location_abbreviation character varying(1024),
    closest_water_body character varying(1024),
    distance numeric,
    major_city_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    created_by_user_id character varying(100),
    updated_by_user_id character varying(100),
    active boolean
);

--
-- Name: major_city_major_city_id_seq; Type: SEQUENCE; Schema: invasivesbc; Owner: invasivebc
--

CREATE SEQUENCE major_city_major_city_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: major_city_major_city_id_seq; Type: SEQUENCE OWNED BY; Schema: invasivesbc; Owner: invasivebc
--

ALTER SEQUENCE major_city_major_city_id_seq OWNED BY major_city.major_city_id;


--
-- Name: major_city major_city_id; Type: DEFAULT; Schema: invasivesbc; Owner: invasivebc
--

ALTER TABLE ONLY major_city ALTER COLUMN major_city_id SET DEFAULT nextval('major_city_major_city_id_seq'::regclass);  


--
-- Name: major_city major_city_pkey; Type: CONSTRAINT; Schema: invasivesbc; Owner: invasivebc
--

ALTER TABLE ONLY major_city
    ADD CONSTRAINT major_city_pkey PRIMARY KEY (major_city_id);
