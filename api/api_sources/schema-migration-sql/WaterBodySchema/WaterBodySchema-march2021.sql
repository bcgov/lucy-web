CREATE TABLE invasivesbc.water_body_2 (
    water_body_id integer NOT NULL,
    water_body_name character varying(100),
    water_body_longitude numeric,
    water_body_latitude numeric,
    country_code character varying(3),
    province_code character varying(2),
    location_abbreviation character varying(100),
    closest_city character varying(100),
    distance numeric,
    district character varying(100),
    district_code character varying(10),
    region character varying(100),
    region_code character varying(10)
);


ALTER TABLE invasivesbc.water_body_2 OWNER TO invasivebc;

--
-- Name: water_body_2_water_body_id_seq; Type: SEQUENCE; Schema: invasivesbc; Owner: invasivebc
--

CREATE SEQUENCE invasivesbc.water_body_2_water_body_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE invasivesbc.water_body_2_water_body_id_seq OWNER TO invasivebc;

--
-- Name: water_body_2_water_body_id_seq; Type: SEQUENCE OWNED BY; Schema: invasivesbc; Owner: invasivebc
--

ALTER SEQUENCE invasivesbc.water_body_2_water_body_id_seq OWNED BY invasivesbc.water_body_2.water_body_id;


--
-- Name: water_body_2 water_body_id; Type: DEFAULT; Schema: invasivesbc; Owner: invasivebc
--

ALTER TABLE ONLY invasivesbc.water_body_2 ALTER COLUMN water_body_id SET DEFAULT nextval('invasivesbc.water_body_2_water_body_id_seq'::regclass);


--
-- Name: water_body_2 water_body_2_pkey; Type: CONSTRAINT; Schema: invasivesbc; Owner: invasivebc
--

ALTER TABLE ONLY invasivesbc.water_body_2
    ADD CONSTRAINT water_body_2_pkey PRIMARY KEY (water_body_id);



-- Merging water body 1 with water body 2 --

-- REGION --

alter table invasivesbc.water_body add column region varchar

update invasivesbc.water_body as wb1

set region = wb2.region

from

invasivesbc.water_body_2 wb2 where

wb1.water_body_id = wb2.water_body_id

-- REGION CODE --

alter table invasivesbc.water_body add column region_code varchar

update invasivesbc.water_body as wb1

set region_code = wb2.region_code

from

invasivesbc.water_body_2 wb2 where

wb1.water_body_id = wb2.water_body_id

-- DISTRICT --

alter table invasivesbc.water_body add column district varchar

update invasivesbc.water_body as wb1

set district = wb2.district

from

invasivesbc.water_body_2 wb2 where

wb1.water_body_id = wb2.water_body_id

-- DISTRICT CODE --

alter table invasivesbc.water_body add column district_code varchar

update invasivesbc.water_body as wb1

set district_code = wb2.district_code

from

invasivesbc.water_body_2 wb2 where

wb1.water_body_id = wb2.water_body_id

-- LOCATION ABBREVIATION --

alter table invasivesbc.water_body add column location_abbreviation varchar

update invasivesbc.water_body as wb1

set location_abbreviation = wb2.location_abbreviation

from

invasivesbc.water_body_2 wb2 where

wb1.water_body_id = wb2.water_body_id
