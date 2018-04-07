CREATE TABLE public.genres
(
    id integer NOT NULL DEFAULT nextval('genres_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT genres_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.genres
    OWNER to postgres;

CREATE TABLE public.movies
(
    id integer NOT NULL DEFAULT nextval('movies_id_seq'::regclass),
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    release_year integer NOT NULL,
    creation_date timestamp with time zone NOT NULL,
    for_kids boolean NOT NULL,
    rating smallint NOT NULL,
    CONSTRAINT movies_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.movies
    OWNER to postgres;

CREATE TABLE public.genres_movies
(
    genre_id integer NOT NULL DEFAULT nextval('genres_movies_genre_id_seq'::regclass),
    movie_id integer NOT NULL DEFAULT nextval('genres_movies_movie_id_seq'::regclass),
    CONSTRAINT genre_fk FOREIGN KEY (genre_id)
        REFERENCES public.genres (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT movie_fk FOREIGN KEY (movie_id)
        REFERENCES public.movies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.genres_movies
    OWNER to postgres;