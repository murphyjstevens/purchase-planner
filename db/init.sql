CREATE DATABASE purchase_planner;

\connect "purchase_planner";

CREATE SEQUENCE product_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 START 4 CACHE 1;

CREATE TABLE "public"."product" (
    "id" integer DEFAULT nextval('product_id_seq') NOT NULL,
    "name" character varying(100) NOT NULL,
    "url" character varying(2048),
    "last_modified" timestamptz NOT NULL,
    "cost" money NOT NULL,
    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
) WITH (oids = false);