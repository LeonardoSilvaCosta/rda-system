
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

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."attended_appointments_result_type" AS (
	"id" "uuid",
	"date" "date",
	"time" time without time zone,
	"protocol" "text",
	"has_leave_of_absence" boolean,
	"record_progress" "text",
	"access" "text",
	"facility" "text",
	"modality" "text",
	"service" "text",
	"psychological_assessment" "text",
	"social_assessment" "text",
	"general_demand" "text",
	"procedure" "text",
	"specialists" "jsonb"[],
	"attendeds" "jsonb"[],
	"specific_demands" "text"[],
	"documents" "text"[],
	"travels" "text"[],
	"referral_destinations" "text"[],
	"referral_types" "text"[]
);

ALTER TYPE "public"."attended_appointments_result_type" OWNER TO "postgres";

CREATE TYPE "public"."attended_profile_result_type" AS (
	"id" "uuid",
	"fullname" "text",
	"nickname" "text",
	"birth_date" "date",
	"avatar" "text",
	"is_civil_volunteer" boolean,
	"rank" "text",
	"cadre" "text",
	"rg" "text",
	"cpf" "text",
	"opm" "text",
	"gender" "text",
	"marital_status" "text",
	"work_status" "text",
	"familiar_bond" "text",
	"address" "jsonb",
	"phones" "jsonb"[],
	"policy_holder" "jsonb",
	"dependents" "jsonb"[]
);

ALTER TYPE "public"."attended_profile_result_type" OWNER TO "postgres";

CREATE TYPE "public"."person_generic_result_type" AS (
	"id" "uuid",
	"fullname" "text",
	"nickname" "text",
	"rg" "text",
	"cpf" "text",
	"rank" "text",
	"cadre" "text"
);

ALTER TYPE "public"."person_generic_result_type" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_new_appointment"("date_input" "date", "time_input" time without time zone, "access_id_input" "uuid", "facility_id_input" "uuid", "modality_id_input" "uuid", "protocol_input" "text", "service_id_input" "uuid", "psychological_assessment_id_input" "uuid", "social_assessment_id_input" "uuid", "general_demand_id_input" "uuid", "procedure_id_input" "uuid", "has_leave_of_absence_input" boolean, "record_progress_input" "text", "registered_by_input" "uuid", "specialists_id_input" "uuid"[], "attendeds_id_input" "uuid"[], "specific_demands_id_input" "uuid"[], "documents_id_input" "uuid"[], "travels_id_input" "uuid"[], "referrals_input" "jsonb"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    created_appointment_id uuid;
    specialist_id_input uuid;
    attended_id_input uuid;
    specific_demand_id_input uuid;
    document_id_input uuid;
    travel_id_input uuid;
    referral_data_input jsonb;
BEGIN
    INSERT INTO tb_appointments (date, time, access_id, facility_id, modality_id, protocol, service_id, psychological_assessment_id, social_assessment_id, general_demand_id, procedure_id, has_leave_of_absence, record_progress, registered_by)
    VALUES (date_input, time_input, access_id_input, facility_id_input, modality_id_input, protocol_input, service_id_input, psychological_assessment_id_input, social_assessment_id_input, general_demand_id_input, procedure_id_input, has_leave_of_absence_input, record_progress_input, registered_by_input)
    RETURNING id INTO created_appointment_id;

    FOREACH specialist_id_input IN ARRAY specialists_id_input
    LOOP
    INSERT INTO tb_appointments_specialists (specialist_id, appointment_id)
    VALUES (specialist_id_input, created_appointment_id);
    END LOOP;

    FOREACH attended_id_input IN ARRAY attendeds_id_input
    LOOP
    INSERT INTO tb_appointments_attendeds (attended_id, appointment_id)
    VALUES (attended_id_input, created_appointment_id);
    END LOOP;

    FOREACH specific_demand_id_input IN ARRAY specific_demands_id_input
    LOOP
    INSERT INTO tb_appointments_specific_demands (specific_demand_id, appointment_id)
    VALUES (specific_demand_id_input, created_appointment_id);
    END LOOP;

    FOREACH document_id_input IN ARRAY documents_id_input
    LOOP
    INSERT INTO tb_appointments_documents (document_id, appointment_id)
    VALUES (document_id_input, created_appointment_id);
    END LOOP;

    FOREACH travel_id_input IN ARRAY travels_id_input
    LOOP
    INSERT INTO tb_appointments_travels (travel_id, appointment_id)
    VALUES (travel_id_input, created_appointment_id);
    END LOOP;

    FOREACH referral_data_input IN ARRAY referrals_input
    LOOP
    INSERT INTO tb_appointment_referrals (destination, type, appointment_id)
    VALUES ((referral_data_input->>'destination')::uuid, (referral_data_input->>'type')::uuid, created_appointment_id);
    END LOOP;
END;
$$;

ALTER FUNCTION "public"."create_new_appointment"("date_input" "date", "time_input" time without time zone, "access_id_input" "uuid", "facility_id_input" "uuid", "modality_id_input" "uuid", "protocol_input" "text", "service_id_input" "uuid", "psychological_assessment_id_input" "uuid", "social_assessment_id_input" "uuid", "general_demand_id_input" "uuid", "procedure_id_input" "uuid", "has_leave_of_absence_input" boolean, "record_progress_input" "text", "registered_by_input" "uuid", "specialists_id_input" "uuid"[], "attendeds_id_input" "uuid"[], "specific_demands_id_input" "uuid"[], "documents_id_input" "uuid"[], "travels_id_input" "uuid"[], "referrals_input" "jsonb"[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_new_attended"("fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "policy_holder_id_input" "uuid", "is_civil_volunteer_input" boolean, "familiar_bond_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    created_attended_id uuid;
    phone_data jsonb;
BEGIN
    INSERT INTO tb_attendeds (fullname, nickname, rg, rank_id, cadre_id, opm_id, gender_id, cpf, birth_date, marital_status_id, policy_holder_id, is_civil_volunteer, familiar_bond_id, work_status_id, registered_by)
    VALUES (fullname_input, nickname_input, rg_input, rank_id_input, cadre_id_input, opm_id_input, gender_id_input, cpf_input, birth_date_input, marital_status_id_input, policy_holder_id_input, is_civil_volunteer_input, familiar_bond_id_input, work_status_id_input, registered_by_input)
    RETURNING id INTO created_attended_id;

    INSERT INTO tb_addresses (zip_code, number, street, neighborhood, city_id, attended_id)
    VALUES (zip_code_input, number_input, street_input, neighborhood_input, city_id_input, created_attended_id);

    FOREACH phone_data IN ARRAY phones_input
    LOOP
        INSERT INTO tb_phones (phone, owner_identification, bond, attended_id)
        VALUES (phone_data->>'phone', phone_data->>'owner_identification', (phone_data->>'bond')::uuid, created_attended_id);
    END LOOP;
END;
$$;

ALTER FUNCTION "public"."create_new_attended"("fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "policy_holder_id_input" "uuid", "is_civil_volunteer_input" boolean, "familiar_bond_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    created_user_id uuid;
    phone_data jsonb;
BEGIN
    INSERT INTO tb_users (avatar, fullname, nickname, rg, rank_id, cadre_id, opm_id, gender_id, cpf, birth_date, marital_status_id, work_status_id, registered_by)
    VALUES (avatar_input, fullname_input, nickname_input, rg_input, rank_id_input, cadre_id_input, opm_id_input, gender_id_input, cpf_input, birth_date_input, marital_status_id_input, work_status_id_input, registered_by_input)
    RETURNING id INTO created_user_id;

    INSERT INTO tb_addresses (zip_code, number, street, neighborhood, city_id, attended_id)
    VALUES (zip_code_input, number_input, street_input, neighborhood_input, city_id_input, created_attended_id);

    FOREACH phone_data IN ARRAY phones_input
    LOOP
        INSERT INTO tb_phones (phone, owner_identification, attended_relationship, attended_id)
        VALUES (phone_data->>'phone', phone_data->>'owner_identification', (phone_data->>'attended_relationship')::uuid, created_attended_id);
    END LOOP;
END;
$$;

ALTER FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "email_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    created_user_id uuid;
    phone_data jsonb;
BEGIN
    INSERT INTO tb_users (avatar, fullname, email, nickname, rg, rank_id, cadre_id, opm_id, gender_id, cpf, birth_date, marital_status_id, work_status_id, registered_by)
    VALUES (avatar_input, fullname_input, email_input, nickname_input, rg_input, rank_id_input, cadre_id_input, opm_id_input, gender_id_input, cpf_input, birth_date_input, marital_status_id_input, work_status_id_input, registered_by_input)
    RETURNING id INTO created_user_id;

    INSERT INTO tb_users_addresses (zip_code, number, street, neighborhood, city_id, user_id)
    VALUES (zip_code_input, number_input, street_input, neighborhood_input, city_id_input, created_user_id);

    FOREACH phone_data IN ARRAY phones_input
    LOOP
        INSERT INTO tb_users_phones (phone, owner_identification, attended_relationship, user_id)
        VALUES (phone_data->>'phone', phone_data->>'owner_identification', (phone_data->>'attended_relationship')::uuid, created_user_id);
    END LOOP;
END;
$$;

ALTER FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "email_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    created_user_id uuid;
    phone_data jsonb;
BEGIN
    INSERT INTO auth.users (email) VALUES (email_input)
    RETURNING id INTO created_user_id;

    INSERT INTO tb_users (id, avatar, fullname, nickname, rg, rank_id, cadre_id, opm_id, gender_id, email, cpf, professional_registration, birth_date, marital_status_id, work_status_id, registered_by)
    VALUES (created_user_id, avatar_input, fullname_input, nickname_input, rg_input, rank_id_input, cadre_id_input, opm_id_input, gender_id_input, email_input, cpf_input, professional_registration_input, birth_date_input, marital_status_id_input, work_status_id_input, registered_by_input);

    INSERT INTO tb_users_addresses (zip_code, number, street, neighborhood, city_id, user_id)
    VALUES (zip_code_input, number_input, street_input, neighborhood_input, city_id_input, created_user_id);

    FOREACH phone_data IN ARRAY phones_input
    LOOP
        INSERT INTO tb_users_phones (phone, owner_identification, bond, user_id)
        VALUES (phone_data->>'phone', phone_data->>'owner_identification', (phone_data->>'bond')::uuid, created_user_id);
    END LOOP;
END;
$$;

ALTER FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "password_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    created_user_id uuid;
    phone_data jsonb;
BEGIN

    INSERT INTO auth.users (id, email, encrypted_password) VALUES (uuid_generate_v4(), email_input, password_input)
    RETURNING id INTO created_user_id;

    INSERT INTO tb_users (id, avatar, fullname, nickname, rg, rank_id, cadre_id, opm_id, gender_id, email, cpf, professional_registration, birth_date, marital_status_id, work_status_id, registered_by)
    VALUES (created_user_id, avatar_input, fullname_input, nickname_input, rg_input, rank_id_input, cadre_id_input, opm_id_input, gender_id_input, email_input, cpf_input, professional_registration_input, birth_date_input, marital_status_id_input, work_status_id_input, registered_by_input);

    INSERT INTO tb_users_addresses (zip_code, number, street, neighborhood, city_id, user_id)
    VALUES (zip_code_input, number_input, street_input, neighborhood_input, city_id_input, created_user_id);

    FOREACH phone_data IN ARRAY phones_input
    LOOP
        INSERT INTO tb_users_phones (phone, owner_identification, bond, user_id)
        VALUES (phone_data->>'phone', phone_data->>'owner_identification', (phone_data->>'bond')::uuid, created_user_id);
    END LOOP;
END;
$$;

ALTER FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "password_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."create_new_user"("user_id_input" "uuid", "avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    phone_data jsonb;
BEGIN
    INSERT INTO tb_users (id, avatar, fullname, nickname, rg, rank_id, cadre_id, opm_id, gender_id, email, cpf, professional_registration, birth_date, marital_status_id, work_status_id, registered_by)
    VALUES (user_id_input, avatar_input, fullname_input, nickname_input, rg_input, rank_id_input, cadre_id_input, opm_id_input, gender_id_input, email_input, cpf_input, professional_registration_input, birth_date_input, marital_status_id_input, work_status_id_input, registered_by_input);

    INSERT INTO tb_users_addresses (zip_code, number, street, neighborhood, city_id, user_id)
    VALUES (zip_code_input, number_input, street_input, neighborhood_input, city_id_input, user_id_input);

    FOREACH phone_data IN ARRAY phones_input
    LOOP
        INSERT INTO tb_users_phones (phone, owner_identification, bond, user_id)
        VALUES (phone_data->>'phone', phone_data->>'owner_identification', (phone_data->>'bond')::uuid, user_id_input);
    END LOOP;
END;
$$;

ALTER FUNCTION "public"."create_new_user"("user_id_input" "uuid", "avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_attended_appointments"("cpf_input" "text") RETURNS SETOF "public"."attended_appointments_result_type"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  app_result attended_appointments_result_type;
BEGIN
  FOR app_result IN (
    SELECT DISTINCT ON (ap.id, ap.date)
           ap.id::text, 
           ap.date::text, 
           ap.time::text, 
           ap.protocol, 
           ap.has_leave_of_absence, 
           ap.record_progress, 
           ac.name AS access, 
           opm.name AS facility, 
           mod.name AS modality,
           sv.name AS service,
           psass.name AS psychological_assessment,
           socass.name AS social_assessments,
           gdem.name AS general_demand,
           proc.name AS procedure,
          (
             SELECT array_agg(json_build_object(
               'rank', spe_rank.name,
               'cadre', spe_cadre.name,
               'rg', spe.rg,
               'nickname', spe.nickname,
               'fullname', spe.fullname,
               'cpf', spe.cpf,
               'professional_registration', spe.professional_registration
             ))
             FROM (
               SELECT DISTINCT apsp.appointment_id, spe.rg
               FROM tb_appointments_specialists apsp
               INNER JOIN tb_users spe ON apsp.specialist_id = spe.id
             ) AS distinct_specialists
             INNER JOIN tb_users spe ON distinct_specialists.rg = spe.rg
             INNER JOIN tb_ranks spe_rank ON spe.rank_id = spe_rank.id
             INNER JOIN tb_cadres spe_cadre ON spe.cadre_id = spe_cadre.id
             WHERE ap.id = distinct_specialists.appointment_id
           ) AS specialists,
           (
             SELECT array_agg(json_build_object(
               'rank', at_rank.name,
               'cadre', at_cadre.name,
               'rg', at.rg,
               'nickname', at.nickname,
               'fullname', at.fullname,
               'cpf', at.cpf
             ))
             FROM (
               SELECT DISTINCT aa.appointment_id, at.cpf
               FROM tb_appointments_attendeds aa
               INNER JOIN tb_attendeds at ON aa.attended_id = at.id
             ) AS distinct_attendeds
             INNER JOIN tb_attendeds at ON distinct_attendeds.cpf = at.cpf
             LEFT JOIN tb_ranks at_rank ON at.rank_id = at_rank.id
             LEFT JOIN tb_cadres at_cadre ON at.cadre_id = at_cadre.id
             WHERE ap.id = distinct_attendeds.appointment_id
           ) AS attendeds,
            (
             SELECT array_agg(sdem.name)
             FROM tb_appointments_specific_demands apsdem
             INNER JOIN tb_specific_demands sdem ON apsdem.specific_demand_id = sdem.id
             WHERE ap.id = apsdem.appointment_id
           ) AS specific_demands,
           (
             SELECT array_agg(doc.name)
             FROM tb_appointments_documents apdoc
             INNER JOIN tb_documents doc ON apdoc.document_id = doc.id
             WHERE ap.id = apdoc.appointment_id
           ) AS documents,
           (
             SELECT array_agg(trav.name)
             FROM tb_appointments_travels aptrav
             INNER JOIN tb_travels trav ON aptrav.travel_id = trav.id
             WHERE ap.id = aptrav.appointment_id
           ) AS travels,
           (
             SELECT array_agg(refdest.name)
             FROM tb_appointment_referrals apref
             INNER JOIN tb_referral_destinations refdest ON apref.destination = refdest.id
             WHERE ap.id = apref.appointment_id
           ) AS referral_destinations,
           (
             SELECT array_agg(reftype.name)
             FROM tb_appointment_referrals apref
             INNER JOIN tb_referral_types reftype ON apref.type = reftype.id
             WHERE ap.id = apref.appointment_id
           ) AS referral_types
    FROM tb_appointments_attendeds aa
    INNER JOIN tb_attendeds at ON aa.attended_id = at.id
    INNER JOIN tb_appointments ap ON aa.appointment_id = ap.id
    INNER JOIN tb_accesses ac ON ap.access_id = ac.id
    INNER JOIN tb_opms opm ON ap.facility_id = opm.id
    INNER JOIN tb_modalities mod ON ap.modality_id = mod.id
    INNER JOIN tb_services sv ON ap.service_id = sv.id
    LEFT JOIN tb_psychological_assessments psass ON ap.psychological_assessment_id = psass.id
    LEFT JOIN tb_social_assessments socass ON ap.social_assessment_id = socass.id
    INNER JOIN tb_general_demands gdem ON ap.general_demand_id = gdem.id
    INNER JOIN tb_procedures proc ON ap.procedure_id = proc.id
    INNER JOIN tb_appointments_specialists apsp ON ap.id = apsp.appointment_id
    INNER JOIN tb_users spe ON apsp.specialist_id = spe.id
    INNER JOIN tb_ranks spe_rank ON spe.rank_id = spe_rank.id
    INNER JOIN tb_cadres spe_cadre ON spe.cadre_id = spe_cadre.id
    LEFT JOIN tb_ranks at_rank ON at.rank_id = at_rank.id
    LEFT JOIN tb_cadres at_cadre ON at.cadre_id = at_cadre.id
    LEFT JOIN tb_appointments_specific_demands apsdem ON ap.id = apsdem.appointment_id
    LEFT JOIN tb_specific_demands sdem ON apsdem.specific_demand_id = sdem.id
    LEFT JOIN tb_appointments_documents apdoc ON ap.id = apdoc.appointment_id
    LEFT JOIN tb_documents doc ON apdoc.document_id = doc.id
    LEFT JOIN tb_appointments_travels aptrav ON ap.id = aptrav.appointment_id
    LEFT JOIN tb_travels trav ON aptrav.travel_id = trav.id
    LEFT JOIN tb_appointment_referrals apref ON ap.id = apref.appointment_id
    LEFT JOIN tb_referral_destinations refdest ON apref.destination = refdest.id
    LEFT JOIN tb_referral_types reftype ON apref.type = reftype.id
    WHERE at.cpf = cpf_input
    ORDER BY ap.date DESC
  ) 
  LOOP
    RETURN NEXT app_result;
  END LOOP;
  RETURN;
END;
$$;

ALTER FUNCTION "public"."get_attended_appointments"("cpf_input" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_attended_appointments"("cpf_input" "text", "q_input" "text") RETURNS SETOF "public"."attended_appointments_result_type"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  app_result attended_appointments_result_type;
BEGIN
  FOR app_result IN (
    SELECT DISTINCT ON (ap.id, ap.date)
           ap.id::text, 
           ap.date::text, 
           ap.time::text, 
           ap.protocol, 
           ap.has_leave_of_absence, 
           ap.record_progress, 
           ac.name AS access, 
           opm.name AS facility, 
           mod.name AS modality,
           sv.name AS service,
           psass.name AS psychological_assessment,
           socass.name AS social_assessments,
           gdem.name AS general_demand,
           proc.name AS procedure,
          (
             SELECT array_agg(json_build_object(
               'rank', spe_rank.name,
               'cadre', spe_cadre.name,
               'rg', spe.rg,
               'nickname', spe.nickname,
               'fullname', spe.fullname,
               'cpf', spe.cpf,
               'professional_registration', spe.professional_registration
             ))
             FROM (
               SELECT DISTINCT apsp.appointment_id, spe.rg
               FROM tb_appointments_specialists apsp
               INNER JOIN tb_users spe ON apsp.specialist_id = spe.id
             ) AS distinct_specialists
             INNER JOIN tb_users spe ON distinct_specialists.rg = spe.rg
             INNER JOIN tb_ranks spe_rank ON spe.rank_id = spe_rank.id
             INNER JOIN tb_cadres spe_cadre ON spe.cadre_id = spe_cadre.id
             WHERE ap.id = distinct_specialists.appointment_id
           ) AS specialists,
           (
             SELECT array_agg(json_build_object(
               'rank', at_rank.name,
               'cadre', at_cadre.name,
               'rg', at.rg,
               'nickname', at.nickname,
               'fullname', at.fullname,
               'cpf', at.cpf
             ))
             FROM (
               SELECT DISTINCT aa.appointment_id, at.cpf
               FROM tb_appointments_attendeds aa
               INNER JOIN tb_attendeds at ON aa.attended_id = at.id
             ) AS distinct_attendeds
             INNER JOIN tb_attendeds at ON distinct_attendeds.cpf = at.cpf
             LEFT JOIN tb_ranks at_rank ON at.rank_id = at_rank.id
             LEFT JOIN tb_cadres at_cadre ON at.cadre_id = at_cadre.id
             WHERE ap.id = distinct_attendeds.appointment_id
           ) AS attendeds,
            (
             SELECT array_agg(sdem.name)
             FROM tb_appointments_specific_demands apsdem
             INNER JOIN tb_specific_demands sdem ON apsdem.specific_demand_id = sdem.id
             WHERE ap.id = apsdem.appointment_id
           ) AS specific_demands,
           (
             SELECT array_agg(doc.name)
             FROM tb_appointments_documents apdoc
             INNER JOIN tb_documents doc ON apdoc.document_id = doc.id
             WHERE ap.id = apdoc.appointment_id
           ) AS documents,
           (
             SELECT array_agg(trav.name)
             FROM tb_appointments_travels aptrav
             INNER JOIN tb_travels trav ON aptrav.travel_id = trav.id
             WHERE ap.id = aptrav.appointment_id
           ) AS travels,
           (
             SELECT array_agg(refdest.name)
             FROM tb_appointment_referrals apref
             INNER JOIN tb_referral_destinations refdest ON apref.destination = refdest.id
             WHERE ap.id = apref.appointment_id
           ) AS referral_destinations,
           (
             SELECT array_agg(reftype.name)
             FROM tb_appointment_referrals apref
             INNER JOIN tb_referral_types reftype ON apref.type = reftype.id
             WHERE ap.id = apref.appointment_id
           ) AS referral_types
    FROM tb_appointments_attendeds aa
    INNER JOIN tb_attendeds at ON aa.attended_id = at.id
    INNER JOIN tb_appointments ap ON aa.appointment_id = ap.id
    INNER JOIN tb_accesses ac ON ap.access_id = ac.id
    INNER JOIN tb_opms opm ON ap.facility_id = opm.id
    INNER JOIN tb_modalities mod ON ap.modality_id = mod.id
    INNER JOIN tb_services sv ON ap.service_id = sv.id
    LEFT JOIN tb_psychological_assessments psass ON ap.psychological_assessment_id = psass.id
    LEFT JOIN tb_social_assessments socass ON ap.social_assessment_id = socass.id
    INNER JOIN tb_general_demands gdem ON ap.general_demand_id = gdem.id
    INNER JOIN tb_procedures proc ON ap.procedure_id = proc.id
    INNER JOIN tb_appointments_specialists apsp ON ap.id = apsp.appointment_id
    INNER JOIN tb_users spe ON apsp.specialist_id = spe.id
    INNER JOIN tb_ranks spe_rank ON spe.rank_id = spe_rank.id
    INNER JOIN tb_cadres spe_cadre ON spe.cadre_id = spe_cadre.id
    LEFT JOIN tb_ranks at_rank ON at.rank_id = at_rank.id
    LEFT JOIN tb_cadres at_cadre ON at.cadre_id = at_cadre.id
    LEFT JOIN tb_appointments_specific_demands apsdem ON ap.id = apsdem.appointment_id
    LEFT JOIN tb_specific_demands sdem ON apsdem.specific_demand_id = sdem.id
    LEFT JOIN tb_appointments_documents apdoc ON ap.id = apdoc.appointment_id
    LEFT JOIN tb_documents doc ON apdoc.document_id = doc.id
    LEFT JOIN tb_appointments_travels aptrav ON ap.id = aptrav.appointment_id
    LEFT JOIN tb_travels trav ON aptrav.travel_id = trav.id
    LEFT JOIN tb_appointment_referrals apref ON ap.id = apref.appointment_id
    LEFT JOIN tb_referral_destinations refdest ON apref.destination = refdest.id
    LEFT JOIN tb_referral_types reftype ON apref.type = reftype.id
    WHERE at.cpf = cpf_input
    ORDER BY ap.date DESC
  ) 
  LOOP
    RETURN NEXT app_result;
  END LOOP;
  RETURN;
END;
$$;

ALTER FUNCTION "public"."get_attended_appointments"("cpf_input" "text", "q_input" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_attended_appointments_by_query"("cpf_input" "text", "q_input" "text") RETURNS SETOF "public"."attended_appointments_result_type"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  app_result attended_appointments_result_type;
BEGIN
  FOR app_result IN (
    SELECT DISTINCT ON (ap.id, ap.date)
           ap.id::text, 
           ap.date::text, 
           ap.time::text, 
           ap.protocol, 
           ap.has_leave_of_absence, 
           ap.record_progress, 
           ac.name AS access, 
           opm.name AS facility, 
           mod.name AS modality,
           sv.name AS service,
           psass.name AS psychological_assessment,
           socass.name AS social_assessments,
           gdem.name AS general_demand,
           proc.name AS procedure,
          (
             SELECT array_agg(json_build_object(
               'rank', spe_rank.name,
               'cadre', spe_cadre.name,
               'rg', spe.rg,
               'nickname', spe.nickname,
               'fullname', spe.fullname,
               'cpf', spe.cpf,
               'professional_registration', spe.professional_registration
             ))
             FROM (
               SELECT DISTINCT apsp.appointment_id, spe.rg
               FROM tb_appointments_specialists apsp
               INNER JOIN tb_users spe ON apsp.specialist_id = spe.id
             ) AS distinct_specialists
             INNER JOIN tb_users spe ON distinct_specialists.rg = spe.rg
             INNER JOIN tb_ranks spe_rank ON spe.rank_id = spe_rank.id
             INNER JOIN tb_cadres spe_cadre ON spe.cadre_id = spe_cadre.id
             WHERE ap.id = distinct_specialists.appointment_id
           ) AS specialists,
           (
             SELECT array_agg(json_build_object(
               'rank', at_rank.name,
               'cadre', at_cadre.name,
               'rg', at.rg,
               'nickname', at.nickname,
               'fullname', at.fullname,
               'cpf', at.cpf
             ))
             FROM (
               SELECT DISTINCT aa.appointment_id, at.cpf
               FROM tb_appointments_attendeds aa
               INNER JOIN tb_attendeds at ON aa.attended_id = at.id
             ) AS distinct_attendeds
             INNER JOIN tb_attendeds at ON distinct_attendeds.cpf = at.cpf
             LEFT JOIN tb_ranks at_rank ON at.rank_id = at_rank.id
             LEFT JOIN tb_cadres at_cadre ON at.cadre_id = at_cadre.id
             WHERE ap.id = distinct_attendeds.appointment_id
           ) AS attendeds,
            (
             SELECT array_agg(sdem.name)
             FROM tb_appointments_specific_demands apsdem
             INNER JOIN tb_specific_demands sdem ON apsdem.specific_demand_id = sdem.id
             WHERE ap.id = apsdem.appointment_id
           ) AS specific_demands,
           (
             SELECT array_agg(doc.name)
             FROM tb_appointments_documents apdoc
             INNER JOIN tb_documents doc ON apdoc.document_id = doc.id
             WHERE ap.id = apdoc.appointment_id
           ) AS documents,
           (
             SELECT array_agg(trav.name)
             FROM tb_appointments_travels aptrav
             INNER JOIN tb_travels trav ON aptrav.travel_id = trav.id
             WHERE ap.id = aptrav.appointment_id
           ) AS travels,
           (
             SELECT array_agg(refdest.name)
             FROM tb_appointment_referrals apref
             INNER JOIN tb_referral_destinations refdest ON apref.destination = refdest.id
             WHERE ap.id = apref.appointment_id
           ) AS referral_destinations,
           (
             SELECT array_agg(reftype.name)
             FROM tb_appointment_referrals apref
             INNER JOIN tb_referral_types reftype ON apref.type = reftype.id
             WHERE ap.id = apref.appointment_id
           ) AS referral_types
    FROM tb_appointments_attendeds aa
    INNER JOIN tb_attendeds at ON aa.attended_id = at.id
    INNER JOIN tb_appointments ap ON aa.appointment_id = ap.id
    INNER JOIN tb_accesses ac ON ap.access_id = ac.id
    INNER JOIN tb_opms opm ON ap.facility_id = opm.id
    INNER JOIN tb_modalities mod ON ap.modality_id = mod.id
    INNER JOIN tb_services sv ON ap.service_id = sv.id
    LEFT JOIN tb_psychological_assessments psass ON ap.psychological_assessment_id = psass.id
    LEFT JOIN tb_social_assessments socass ON ap.social_assessment_id = socass.id
    INNER JOIN tb_general_demands gdem ON ap.general_demand_id = gdem.id
    INNER JOIN tb_procedures proc ON ap.procedure_id = proc.id
    INNER JOIN tb_appointments_specialists apsp ON ap.id = apsp.appointment_id
    INNER JOIN tb_users spe ON apsp.specialist_id = spe.id
    INNER JOIN tb_ranks spe_rank ON spe.rank_id = spe_rank.id
    INNER JOIN tb_cadres spe_cadre ON spe.cadre_id = spe_cadre.id
    LEFT JOIN tb_ranks at_rank ON at.rank_id = at_rank.id
    LEFT JOIN tb_cadres at_cadre ON at.cadre_id = at_cadre.id
    LEFT JOIN tb_appointments_specific_demands apsdem ON ap.id = apsdem.appointment_id
    LEFT JOIN tb_specific_demands sdem ON apsdem.specific_demand_id = sdem.id
    LEFT JOIN tb_appointments_documents apdoc ON ap.id = apdoc.appointment_id
    LEFT JOIN tb_documents doc ON apdoc.document_id = doc.id
    LEFT JOIN tb_appointments_travels aptrav ON ap.id = aptrav.appointment_id
    LEFT JOIN tb_travels trav ON aptrav.travel_id = trav.id
    LEFT JOIN tb_appointment_referrals apref ON ap.id = apref.appointment_id
    LEFT JOIN tb_referral_destinations refdest ON apref.destination = refdest.id
    LEFT JOIN tb_referral_types reftype ON apref.type = reftype.id
    WHERE at.cpf = cpf_input
    AND (TO_CHAR(ap.date, 'DD/MM/YYYY') ILIKE ('%' || q_input || '%') OR proc.name ILIKE ('%' || q_input || '%') OR ap.protocol ILIKE ('%' || q_input || '%') OR gdem.name ILIKE ('%' || q_input || '%') OR sv.name ILIKE ('%' || q_input || '%'))
    ORDER BY ap.date DESC
  ) 
  LOOP
    RETURN NEXT app_result;
  END LOOP;
  RETURN;
END;
$$;

ALTER FUNCTION "public"."get_attended_appointments_by_query"("cpf_input" "text", "q_input" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_attended_profile"("cpf_input" "text") RETURNS SETOF "public"."attended_profile_result_type"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  app_result attended_profile_result_type;
BEGIN
  FOR app_result IN (
    SELECT DISTINCT ON (at.id)
      at.id::text, 
      at.fullname, 
      at.nickname, 
      at.birth_date::text, 
      at.avatar, 
      at.is_civil_volunteer, 
      rank.name AS rank,
      cadre.name AS cadre,
      at.rg,
      at.cpf,
      opm.name AS opm,
      gender.name AS gender,
      marital_status.name AS marital_status,
      work_status.name AS work_status,
      fbond.name AS familiar_bond,
      json_build_object(
        'zip_code', add.zip_code,
        'number', add.number,
        'street', add.street,
        'complement', add.complement,
        'neighborhood', add.neighborhood
      ) AS address,
      (
        SELECT array_agg(json_build_object(
          'phone', phone.phone,
          'owner_identification', phone.owner_identification,
          'bond', fb.name
        ))
        FROM tb_phones phone
        LEFT JOIN tb_familiar_bonds fb
        ON phone.bond = fb.id
        WHERE at.id = phone.attended_id
      ) AS phones,
      json_build_object(
        'rank', polrank.name,
        'cadre', polcadre.name,
        'rg', polhol.rg,
        'nickname', polhol.nickname,
        'cpf', polhol.cpf
      ) AS policy_holder,
      (
        SELECT array_agg(json_build_object(
          'id', dependent.id,
          'fullname', dependent.fullname,
          'cpf', dependent.cpf,
          'familiar_bond', fb.name
        ))
        FROM tb_attendeds dependent
        LEFT JOIN tb_familiar_bonds fb
        ON dependent.familiar_bond_id = fb.id
        WHERE at.id = dependent.policy_holder_id
      ) AS dependents
    FROM tb_attendeds at
    LEFT JOIN tb_ranks rank ON at.rank_id = rank.id
    LEFT JOIN tb_cadres cadre ON at.cadre_id = cadre.id
    LEFT JOIN tb_opms opm ON at.opm_id = opm.id
    INNER JOIN tb_genders gender ON at.gender_id = gender.id
    INNER JOIN tb_marital_status marital_status ON at.marital_status_id = marital_status.id
    LEFT JOIN tb_work_status work_status ON at.work_status_id = work_status.id
    LEFT JOIN tb_familiar_bonds fbond ON at.familiar_bond_id = fbond.id
    LEFT JOIN tb_addresses add ON at.id = add.attended_id
    LEFT JOIN tb_attendeds polhol ON at.policy_holder_id = polhol.id
    LEFT JOIN tb_ranks polrank ON polhol.rank_id = polrank.id
    LEFT JOIN tb_cadres polcadre ON polhol.cadre_id = polcadre.id
    WHERE at.cpf = cpf_input
  )
  LOOP
    RETURN NEXT app_result;
  END LOOP;
  RETURN;
END;
$$;

ALTER FUNCTION "public"."get_attended_profile"("cpf_input" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_attendeds_by_query"("q_input" "text") RETURNS SETOF "public"."person_generic_result_type"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT at.id, at.fullname, at.nickname, at.rg, at.cpf, rank.name AS rank, cadre.name AS cadre
    FROM tb_attendeds at
    LEFT JOIN tb_ranks rank ON at.rank_id = rank.id
    LEFT JOIN tb_cadres cadre ON at.cadre_id = cadre.id
    WHERE at.nickname ILIKE ('%' || q_input || '%') OR at.rg = q_input OR at.fullname ILIKE ('%' || q_input || '%') OR at.cpf = q_input
    ORDER BY at.rg ASC;

    RETURN;
END;
$$;

ALTER FUNCTION "public"."get_attendeds_by_query"("q_input" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_specialists_by_query"("q_input" "text") RETURNS SETOF "public"."person_generic_result_type"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT esp.id, esp.fullname, esp.nickname, esp.rg, esp.cpf, rank.name AS rank, cadre.name AS cadre
    FROM tb_users esp
    INNER JOIN tb_ranks rank ON esp.rank_id = rank.id
    INNER JOIN tb_cadres cadre ON esp.cadre_id = cadre.id
    WHERE esp.nickname ILIKE ('%' || q_input || '%') OR esp.rg = q_input
    ORDER BY esp.rg ASC;

    RETURN;
END;
$$;

ALTER FUNCTION "public"."get_specialists_by_query"("q_input" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."tb_accesses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_accesses" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_documents" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_general_demands" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_general_demands" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_modalities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_modalities" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_opms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "cdm_id" "uuid" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_opms" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_procedures" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_procedures" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_psychological_assessments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_psychological_assessments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_referral_destinations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_referral_destinations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_referral_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_referral_types" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_services" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_services" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_social_assessments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_social_assessments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_specific_demands" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_specific_demands" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_travels" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_travels" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."appointmentformdata" AS
 SELECT "tb_accesses"."id",
    "tb_accesses"."ordenation",
    "tb_accesses"."name",
    'Access'::"text" AS "source"
   FROM "public"."tb_accesses"
UNION ALL
 SELECT "tb_opms"."id",
    "tb_opms"."ordenation",
    "tb_opms"."name",
    'Facility'::"text" AS "source"
   FROM "public"."tb_opms"
UNION ALL
 SELECT "tb_modalities"."id",
    "tb_modalities"."ordenation",
    "tb_modalities"."name",
    'Modality'::"text" AS "source"
   FROM "public"."tb_modalities"
UNION ALL
 SELECT "tb_services"."id",
    "tb_services"."ordenation",
    "tb_services"."name",
    'Service'::"text" AS "source"
   FROM "public"."tb_services"
UNION ALL
 SELECT "tb_psychological_assessments"."id",
    "tb_psychological_assessments"."ordenation",
    "tb_psychological_assessments"."name",
    'Psychological assessment'::"text" AS "source"
   FROM "public"."tb_psychological_assessments"
UNION ALL
 SELECT "tb_social_assessments"."id",
    "tb_social_assessments"."ordenation",
    "tb_social_assessments"."name",
    'Social assessment'::"text" AS "source"
   FROM "public"."tb_social_assessments"
UNION ALL
 SELECT "tb_general_demands"."id",
    "tb_general_demands"."ordenation",
    "tb_general_demands"."name",
    'General demand'::"text" AS "source"
   FROM "public"."tb_general_demands"
UNION ALL
 SELECT "tb_specific_demands"."id",
    "tb_specific_demands"."ordenation",
    "tb_specific_demands"."name",
    'Specific demand'::"text" AS "source"
   FROM "public"."tb_specific_demands"
UNION ALL
 SELECT "tb_procedures"."id",
    "tb_procedures"."ordenation",
    "tb_procedures"."name",
    'Procedure'::"text" AS "source"
   FROM "public"."tb_procedures"
UNION ALL
 SELECT "tb_referral_destinations"."id",
    "tb_referral_destinations"."ordenation",
    "tb_referral_destinations"."name",
    'Referral destination'::"text" AS "source"
   FROM "public"."tb_referral_destinations"
UNION ALL
 SELECT "tb_referral_types"."id",
    "tb_referral_types"."ordenation",
    "tb_referral_types"."name",
    'Referral type'::"text" AS "source"
   FROM "public"."tb_referral_types"
UNION ALL
 SELECT "tb_documents"."id",
    "tb_documents"."ordenation",
    "tb_documents"."name",
    'Document'::"text" AS "source"
   FROM "public"."tb_documents"
UNION ALL
 SELECT "tb_travels"."id",
    "tb_travels"."ordenation",
    "tb_travels"."name",
    'Travel'::"text" AS "source"
   FROM "public"."tb_travels";

ALTER TABLE "public"."appointmentformdata" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_cadres" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_cadres" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_familiar_bonds" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint
);

ALTER TABLE "public"."tb_familiar_bonds" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_genders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_genders" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_marital_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint NOT NULL
);

ALTER TABLE "public"."tb_marital_status" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_ranks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" smallint NOT NULL
);

ALTER TABLE "public"."tb_ranks" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_work_status" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "ordenation" bigint
);

ALTER TABLE "public"."tb_work_status" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."clientformdata" AS
 SELECT "tb_genders"."id",
    "tb_genders"."ordenation",
    "tb_genders"."name",
    'Gender'::"text" AS "source"
   FROM "public"."tb_genders"
UNION ALL
 SELECT "tb_marital_status"."id",
    "tb_marital_status"."ordenation",
    "tb_marital_status"."name",
    'Marital status'::"text" AS "source"
   FROM "public"."tb_marital_status"
UNION ALL
 SELECT "tb_ranks"."id",
    "tb_ranks"."ordenation",
    "tb_ranks"."name",
    'Rank'::"text" AS "source"
   FROM "public"."tb_ranks"
UNION ALL
 SELECT "tb_cadres"."id",
    "tb_cadres"."ordenation",
    "tb_cadres"."name",
    'Cadre'::"text" AS "source"
   FROM "public"."tb_cadres"
UNION ALL
 SELECT "tb_opms"."id",
    "tb_opms"."ordenation",
    "tb_opms"."name",
    'OPM'::"text" AS "source"
   FROM "public"."tb_opms"
UNION ALL
 SELECT "tb_work_status"."id",
    "tb_work_status"."ordenation",
    "tb_work_status"."name",
    'Work status'::"text" AS "source"
   FROM "public"."tb_work_status"
UNION ALL
 SELECT "tb_familiar_bonds"."id",
    "tb_familiar_bonds"."ordenation",
    "tb_familiar_bonds"."name",
    'Familiar bond'::"text" AS "source"
   FROM "public"."tb_familiar_bonds";

ALTER TABLE "public"."clientformdata" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_addresses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "zip_code" "text" NOT NULL,
    "number" "text" NOT NULL,
    "street" "text" NOT NULL,
    "complement" "text",
    "city_id" "uuid" NOT NULL,
    "attended_id" "uuid" NOT NULL,
    "neighborhood" "text" NOT NULL
);

ALTER TABLE "public"."tb_addresses" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_appointment_referrals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "destination" "uuid" NOT NULL,
    "type" "uuid" NOT NULL,
    "appointment_id" "uuid" NOT NULL
);

ALTER TABLE "public"."tb_appointment_referrals" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_appointments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "date" "date" NOT NULL,
    "time" time without time zone NOT NULL,
    "access_id" "uuid" NOT NULL,
    "facility_id" "uuid" NOT NULL,
    "modality_id" "uuid" NOT NULL,
    "protocol" "text",
    "service_id" "uuid" NOT NULL,
    "psychological_assessment_id" "uuid",
    "social_assessment_id" "uuid",
    "general_demand_id" "uuid" NOT NULL,
    "procedure_id" "uuid" NOT NULL,
    "has_leave_of_absence" boolean NOT NULL,
    "record_progress" "text" NOT NULL,
    "registered_by" "uuid"
);

ALTER TABLE "public"."tb_appointments" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_appointments_attendeds" (
    "appointment_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "attended_id" "uuid" NOT NULL
);

ALTER TABLE "public"."tb_appointments_attendeds" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_appointments_documents" (
    "appointment_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "document_id" "uuid" NOT NULL
);

ALTER TABLE "public"."tb_appointments_documents" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_appointments_specialists" (
    "appointment_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "specialist_id" "uuid" NOT NULL
);

ALTER TABLE "public"."tb_appointments_specialists" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_appointments_specific_demands" (
    "appointment_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "specific_demand_id" "uuid" NOT NULL
);

ALTER TABLE "public"."tb_appointments_specific_demands" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_appointments_travels" (
    "appointment_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "travel_id" "uuid" NOT NULL
);

ALTER TABLE "public"."tb_appointments_travels" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_attendeds" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "fullname" "text" NOT NULL,
    "nickname" "text",
    "rg" "text",
    "rank_id" "uuid",
    "cadre_id" "uuid",
    "opm_id" "uuid",
    "gender_id" "uuid" NOT NULL,
    "cpf" "text" NOT NULL,
    "birth_date" "date",
    "marital_status_id" "uuid",
    "registered_by" "uuid",
    "policy_holder_id" "uuid",
    "is_civil_volunteer" boolean DEFAULT false NOT NULL,
    "familiar_bond_id" "uuid",
    "work_status_id" "uuid",
    "avatar" "text"
);

ALTER TABLE "public"."tb_attendeds" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_cities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "state_id" "uuid" NOT NULL
);

ALTER TABLE "public"."tb_cities" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_cmds" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL
);

ALTER TABLE "public"."tb_cmds" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_phones" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "owner_identification" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "bond" "uuid",
    "attended_id" "uuid" NOT NULL
);

ALTER TABLE "public"."tb_phones" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_states" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "acronym" "text" NOT NULL
);

ALTER TABLE "public"."tb_states" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "fullname" "text" NOT NULL,
    "nickname" "text",
    "rg" "text",
    "rank_id" "uuid",
    "cadre_id" "uuid",
    "opm_id" "uuid",
    "gender_id" "uuid" NOT NULL,
    "cpf" "text" NOT NULL,
    "birth_date" "date" NOT NULL,
    "marital_status_id" "uuid" NOT NULL,
    "registered_by" "uuid",
    "work_status_id" "uuid",
    "avatar" "text",
    "email" "text" NOT NULL,
    "professional_registration" "text"
);

ALTER TABLE "public"."tb_users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_users_addresses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "zip_code" "text" NOT NULL,
    "number" "text" NOT NULL,
    "street" "text" NOT NULL,
    "complement" "text",
    "city_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "neighborhood" "text" NOT NULL
);

ALTER TABLE "public"."tb_users_addresses" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tb_users_phones" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "owner_identification" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "bond" "uuid",
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."tb_users_phones" OWNER TO "postgres";

ALTER TABLE ONLY "public"."tb_attendeds"
    ADD CONSTRAINT "rda_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_accesses"
    ADD CONSTRAINT "tb_accesses_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_accesses"
    ADD CONSTRAINT "tb_accesses_ordenation_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_accesses"
    ADD CONSTRAINT "tb_accesses_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_addresses"
    ADD CONSTRAINT "tb_addresses_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_appointments_attendeds"
    ADD CONSTRAINT "tb_appointments_attendeds_pkey" PRIMARY KEY ("appointment_id", "attended_id");

ALTER TABLE ONLY "public"."tb_appointments_documents"
    ADD CONSTRAINT "tb_appointments_documents_pkey" PRIMARY KEY ("appointment_id", "document_id");

ALTER TABLE ONLY "public"."tb_appointments_specific_demands"
    ADD CONSTRAINT "tb_appointments_specific_demands_pkey" PRIMARY KEY ("appointment_id", "specific_demand_id");

ALTER TABLE ONLY "public"."tb_appointments_travels"
    ADD CONSTRAINT "tb_appointments_travels_pkey" PRIMARY KEY ("appointment_id", "travel_id");

ALTER TABLE ONLY "public"."tb_appointments"
    ADD CONSTRAINT "tb_appontments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_cadres"
    ADD CONSTRAINT "tb_cadre_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_cadres"
    ADD CONSTRAINT "tb_cadres_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_cadres"
    ADD CONSTRAINT "tb_cadres_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_cities"
    ADD CONSTRAINT "tb_cities_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_cmds"
    ADD CONSTRAINT "tb_cmds_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_cmds"
    ADD CONSTRAINT "tb_cmds_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_documents"
    ADD CONSTRAINT "tb_documents_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_documents"
    ADD CONSTRAINT "tb_documents_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_documents"
    ADD CONSTRAINT "tb_documents_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_familiar_bonds"
    ADD CONSTRAINT "tb_familiar_bonds_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_familiar_bonds"
    ADD CONSTRAINT "tb_familiar_bonds_ordenation_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_familiar_bonds"
    ADD CONSTRAINT "tb_familiar_bonds_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_genders"
    ADD CONSTRAINT "tb_genders_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_genders"
    ADD CONSTRAINT "tb_genders_ordenation_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_genders"
    ADD CONSTRAINT "tb_genders_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_general_demands"
    ADD CONSTRAINT "tb_general_demands_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_general_demands"
    ADD CONSTRAINT "tb_general_demands_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_general_demands"
    ADD CONSTRAINT "tb_general_demands_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_marital_status"
    ADD CONSTRAINT "tb_marital_status_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_marital_status"
    ADD CONSTRAINT "tb_marital_status_ordenation_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_marital_status"
    ADD CONSTRAINT "tb_marital_status_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_modalities"
    ADD CONSTRAINT "tb_modalities_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_modalities"
    ADD CONSTRAINT "tb_modalities_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_modalities"
    ADD CONSTRAINT "tb_modalities_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_opms"
    ADD CONSTRAINT "tb_opms_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_phones"
    ADD CONSTRAINT "tb_phones_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_procedures"
    ADD CONSTRAINT "tb_procedures_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_procedures"
    ADD CONSTRAINT "tb_procedures_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_procedures"
    ADD CONSTRAINT "tb_procedures_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_psychological_assessments"
    ADD CONSTRAINT "tb_psychological_assessments_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_psychological_assessments"
    ADD CONSTRAINT "tb_psychological_assessments_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_psychological_assessments"
    ADD CONSTRAINT "tb_psychological_assessments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_ranks"
    ADD CONSTRAINT "tb_ranks_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_ranks"
    ADD CONSTRAINT "tb_ranks_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_ranks"
    ADD CONSTRAINT "tb_ranks_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_referral_destinations"
    ADD CONSTRAINT "tb_referral_destinations_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_referral_destinations"
    ADD CONSTRAINT "tb_referral_destinations_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_referral_destinations"
    ADD CONSTRAINT "tb_referral_destinations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_referral_types"
    ADD CONSTRAINT "tb_referral_types_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_referral_types"
    ADD CONSTRAINT "tb_referral_types_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_referral_types"
    ADD CONSTRAINT "tb_referral_types_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_appointment_referrals"
    ADD CONSTRAINT "tb_referrals_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_services"
    ADD CONSTRAINT "tb_services_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_services"
    ADD CONSTRAINT "tb_services_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_services"
    ADD CONSTRAINT "tb_services_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_social_assessments"
    ADD CONSTRAINT "tb_social_assessments_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_social_assessments"
    ADD CONSTRAINT "tb_social_assessments_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_social_assessments"
    ADD CONSTRAINT "tb_social_assessments_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_specific_demands"
    ADD CONSTRAINT "tb_specific_demands_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_specific_demands"
    ADD CONSTRAINT "tb_specific_demands_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_specific_demands"
    ADD CONSTRAINT "tb_specific_demands_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_states"
    ADD CONSTRAINT "tb_states_acronym_key" UNIQUE ("acronym");

ALTER TABLE ONLY "public"."tb_states"
    ADD CONSTRAINT "tb_states_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_states"
    ADD CONSTRAINT "tb_states_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_travels"
    ADD CONSTRAINT "tb_travels_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_travels"
    ADD CONSTRAINT "tb_travels_order_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_travels"
    ADD CONSTRAINT "tb_travels_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_opms"
    ADD CONSTRAINT "tb_units_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_users_addresses"
    ADD CONSTRAINT "tb_users_addresses_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_users"
    ADD CONSTRAINT "tb_users_email_key" UNIQUE ("email");

ALTER TABLE ONLY "public"."tb_users_phones"
    ADD CONSTRAINT "tb_users_phones_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_users"
    ADD CONSTRAINT "tb_users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."tb_work_status"
    ADD CONSTRAINT "tb_work_status_name_key" UNIQUE ("name");

ALTER TABLE ONLY "public"."tb_work_status"
    ADD CONSTRAINT "tb_work_status_ordenation_key" UNIQUE ("ordenation");

ALTER TABLE ONLY "public"."tb_work_status"
    ADD CONSTRAINT "tb_work_status_pkey" PRIMARY KEY ("id");

CREATE INDEX "idx_attended_cpf" ON "public"."tb_attendeds" USING "btree" ("cpf");

ALTER TABLE ONLY "public"."tb_addresses"
    ADD CONSTRAINT "tb_addresses_attended_id_fkey" FOREIGN KEY ("attended_id") REFERENCES "public"."tb_attendeds"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_addresses"
    ADD CONSTRAINT "tb_addresses_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."tb_cities"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_appointment_referrals"
    ADD CONSTRAINT "tb_appointment_referrals_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."tb_appointments"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_appointment_referrals"
    ADD CONSTRAINT "tb_appointment_referrals_destination_fkey" FOREIGN KEY ("destination") REFERENCES "public"."tb_referral_destinations"("id");

ALTER TABLE ONLY "public"."tb_appointment_referrals"
    ADD CONSTRAINT "tb_appointment_referrals_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."tb_referral_types"("id");

ALTER TABLE ONLY "public"."tb_appointments"
    ADD CONSTRAINT "tb_appointments_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "public"."tb_accesses"("id");

ALTER TABLE ONLY "public"."tb_appointments_attendeds"
    ADD CONSTRAINT "tb_appointments_attendeds_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."tb_appointments"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_appointments_attendeds"
    ADD CONSTRAINT "tb_appointments_attendeds_attended_id_fkey" FOREIGN KEY ("attended_id") REFERENCES "public"."tb_attendeds"("id") ON UPDATE CASCADE;

ALTER TABLE ONLY "public"."tb_appointments_documents"
    ADD CONSTRAINT "tb_appointments_documents_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."tb_appointments"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_appointments_documents"
    ADD CONSTRAINT "tb_appointments_documents_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."tb_documents"("id");

ALTER TABLE ONLY "public"."tb_appointments"
    ADD CONSTRAINT "tb_appointments_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "public"."tb_opms"("id");

ALTER TABLE ONLY "public"."tb_appointments"
    ADD CONSTRAINT "tb_appointments_general_demand_id_fkey" FOREIGN KEY ("general_demand_id") REFERENCES "public"."tb_general_demands"("id");

ALTER TABLE ONLY "public"."tb_appointments"
    ADD CONSTRAINT "tb_appointments_modality_id_fkey" FOREIGN KEY ("modality_id") REFERENCES "public"."tb_modalities"("id");

ALTER TABLE ONLY "public"."tb_appointments"
    ADD CONSTRAINT "tb_appointments_procedure_id_fkey" FOREIGN KEY ("procedure_id") REFERENCES "public"."tb_procedures"("id");

ALTER TABLE ONLY "public"."tb_appointments"
    ADD CONSTRAINT "tb_appointments_psychological_assessment_id_fkey" FOREIGN KEY ("psychological_assessment_id") REFERENCES "public"."tb_psychological_assessments"("id");

ALTER TABLE ONLY "public"."tb_appointments"
    ADD CONSTRAINT "tb_appointments_registered_by_fkey" FOREIGN KEY ("registered_by") REFERENCES "public"."tb_users"("id");

ALTER TABLE ONLY "public"."tb_appointments"
    ADD CONSTRAINT "tb_appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."tb_services"("id");

ALTER TABLE ONLY "public"."tb_appointments"
    ADD CONSTRAINT "tb_appointments_social_assessment_id_fkey" FOREIGN KEY ("social_assessment_id") REFERENCES "public"."tb_social_assessments"("id");

ALTER TABLE ONLY "public"."tb_appointments_specialists"
    ADD CONSTRAINT "tb_appointments_specialists_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."tb_appointments"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_appointments_specialists"
    ADD CONSTRAINT "tb_appointments_specialists_specialist_id_fkey" FOREIGN KEY ("specialist_id") REFERENCES "public"."tb_users"("id");

ALTER TABLE ONLY "public"."tb_appointments_specific_demands"
    ADD CONSTRAINT "tb_appointments_specific_demands_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."tb_appointments"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_appointments_specific_demands"
    ADD CONSTRAINT "tb_appointments_specific_demands_specific_demand_id_fkey" FOREIGN KEY ("specific_demand_id") REFERENCES "public"."tb_specific_demands"("id");

ALTER TABLE ONLY "public"."tb_appointments_travels"
    ADD CONSTRAINT "tb_appointments_travels_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."tb_appointments"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_appointments_travels"
    ADD CONSTRAINT "tb_appointments_travels_travel_id_fkey" FOREIGN KEY ("travel_id") REFERENCES "public"."tb_travels"("id");

ALTER TABLE ONLY "public"."tb_attendeds"
    ADD CONSTRAINT "tb_attendeds_cadre_id_fkey" FOREIGN KEY ("cadre_id") REFERENCES "public"."tb_cadres"("id");

ALTER TABLE ONLY "public"."tb_attendeds"
    ADD CONSTRAINT "tb_attendeds_familiar_bond_id_fkey" FOREIGN KEY ("familiar_bond_id") REFERENCES "public"."tb_familiar_bonds"("id");

ALTER TABLE ONLY "public"."tb_attendeds"
    ADD CONSTRAINT "tb_attendeds_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "public"."tb_genders"("id");

ALTER TABLE ONLY "public"."tb_attendeds"
    ADD CONSTRAINT "tb_attendeds_marital_status_id_fkey" FOREIGN KEY ("marital_status_id") REFERENCES "public"."tb_marital_status"("id");

ALTER TABLE ONLY "public"."tb_attendeds"
    ADD CONSTRAINT "tb_attendeds_opm_id_fkey" FOREIGN KEY ("opm_id") REFERENCES "public"."tb_opms"("id");

ALTER TABLE ONLY "public"."tb_attendeds"
    ADD CONSTRAINT "tb_attendeds_policy_holder_id_fkey" FOREIGN KEY ("policy_holder_id") REFERENCES "public"."tb_attendeds"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_attendeds"
    ADD CONSTRAINT "tb_attendeds_rank_id_fkey" FOREIGN KEY ("rank_id") REFERENCES "public"."tb_ranks"("id");

ALTER TABLE ONLY "public"."tb_attendeds"
    ADD CONSTRAINT "tb_attendeds_work_status_id_fkey" FOREIGN KEY ("work_status_id") REFERENCES "public"."tb_work_status"("id");

ALTER TABLE ONLY "public"."tb_cities"
    ADD CONSTRAINT "tb_cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."tb_states"("id");

ALTER TABLE ONLY "public"."tb_phones"
    ADD CONSTRAINT "tb_phones_attended_id_fkey" FOREIGN KEY ("attended_id") REFERENCES "public"."tb_attendeds"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_phones"
    ADD CONSTRAINT "tb_phones_bond_fkey" FOREIGN KEY ("bond") REFERENCES "public"."tb_familiar_bonds"("id") ON DELETE SET NULL;

ALTER TABLE ONLY "public"."tb_users_addresses"
    ADD CONSTRAINT "tb_users_addresses_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."tb_cities"("id");

ALTER TABLE ONLY "public"."tb_users_addresses"
    ADD CONSTRAINT "tb_users_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."tb_users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_users"
    ADD CONSTRAINT "tb_users_cadre_id_fkey" FOREIGN KEY ("cadre_id") REFERENCES "public"."tb_cadres"("id");

ALTER TABLE ONLY "public"."tb_users"
    ADD CONSTRAINT "tb_users_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "public"."tb_genders"("id");

ALTER TABLE ONLY "public"."tb_users"
    ADD CONSTRAINT "tb_users_marital_status_id_fkey" FOREIGN KEY ("marital_status_id") REFERENCES "public"."tb_marital_status"("id");

ALTER TABLE ONLY "public"."tb_users"
    ADD CONSTRAINT "tb_users_opm_id_fkey" FOREIGN KEY ("opm_id") REFERENCES "public"."tb_opms"("id");

ALTER TABLE ONLY "public"."tb_users_phones"
    ADD CONSTRAINT "tb_users_phones_bond_fkey" FOREIGN KEY ("bond") REFERENCES "public"."tb_familiar_bonds"("id");

ALTER TABLE ONLY "public"."tb_users_phones"
    ADD CONSTRAINT "tb_users_phones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."tb_users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."tb_users"
    ADD CONSTRAINT "tb_users_rank_id_fkey" FOREIGN KEY ("rank_id") REFERENCES "public"."tb_ranks"("id");

ALTER TABLE ONLY "public"."tb_users"
    ADD CONSTRAINT "tb_users_work_status_id_fkey" FOREIGN KEY ("work_status_id") REFERENCES "public"."tb_work_status"("id");

CREATE POLICY "enable_read_access_to_authenticated" ON "public"."tb_addresses" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_authenticated" ON "public"."tb_appointment_referrals" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_authenticated" ON "public"."tb_appointments" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_authenticated" ON "public"."tb_appointments_attendeds" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_authenticated" ON "public"."tb_appointments_documents" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_authenticated" ON "public"."tb_appointments_specialists" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_authenticated" ON "public"."tb_appointments_specific_demands" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_authenticated" ON "public"."tb_appointments_travels" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_authenticated" ON "public"."tb_attendeds" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_authenticated" ON "public"."tb_phones" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_authenticated" ON "public"."tb_users" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_accesses" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_cadres" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_cities" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_cmds" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_documents" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_familiar_bonds" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_genders" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_general_demands" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_marital_status" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_modalities" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_opms" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_procedures" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_psychological_assessments" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_ranks" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_referral_destinations" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_referral_types" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_services" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_social_assessments" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_specific_demands" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_states" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_travels" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_read_access_to_everyone_authenticated" ON "public"."tb_work_status" FOR SELECT TO "authenticated" USING (true);

CREATE POLICY "enable_write_access_to_authenticated" ON "public"."tb_addresses" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "enable_write_access_to_authenticated" ON "public"."tb_appointment_referrals" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "enable_write_access_to_authenticated" ON "public"."tb_appointments" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "enable_write_access_to_authenticated" ON "public"."tb_appointments_attendeds" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "enable_write_access_to_authenticated" ON "public"."tb_appointments_documents" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "enable_write_access_to_authenticated" ON "public"."tb_appointments_specialists" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "enable_write_access_to_authenticated" ON "public"."tb_appointments_specific_demands" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "enable_write_access_to_authenticated" ON "public"."tb_appointments_travels" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "enable_write_access_to_authenticated" ON "public"."tb_attendeds" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "enable_write_access_to_authenticated" ON "public"."tb_phones" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "enable_write_access_to_authenticated" ON "public"."tb_users" FOR INSERT TO "authenticated" WITH CHECK (true);

ALTER TABLE "public"."tb_accesses" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_addresses" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_appointment_referrals" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_appointments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_appointments_attendeds" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_appointments_documents" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_appointments_specialists" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_appointments_specific_demands" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_appointments_travels" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_attendeds" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_cadres" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_cities" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_cmds" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_documents" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_familiar_bonds" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_genders" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_general_demands" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_marital_status" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_modalities" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_opms" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_phones" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_procedures" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_psychological_assessments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_ranks" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_referral_destinations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_referral_types" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_services" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_social_assessments" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_specific_demands" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_states" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_travels" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."tb_work_status" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_new_appointment"("date_input" "date", "time_input" time without time zone, "access_id_input" "uuid", "facility_id_input" "uuid", "modality_id_input" "uuid", "protocol_input" "text", "service_id_input" "uuid", "psychological_assessment_id_input" "uuid", "social_assessment_id_input" "uuid", "general_demand_id_input" "uuid", "procedure_id_input" "uuid", "has_leave_of_absence_input" boolean, "record_progress_input" "text", "registered_by_input" "uuid", "specialists_id_input" "uuid"[], "attendeds_id_input" "uuid"[], "specific_demands_id_input" "uuid"[], "documents_id_input" "uuid"[], "travels_id_input" "uuid"[], "referrals_input" "jsonb"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_new_appointment"("date_input" "date", "time_input" time without time zone, "access_id_input" "uuid", "facility_id_input" "uuid", "modality_id_input" "uuid", "protocol_input" "text", "service_id_input" "uuid", "psychological_assessment_id_input" "uuid", "social_assessment_id_input" "uuid", "general_demand_id_input" "uuid", "procedure_id_input" "uuid", "has_leave_of_absence_input" boolean, "record_progress_input" "text", "registered_by_input" "uuid", "specialists_id_input" "uuid"[], "attendeds_id_input" "uuid"[], "specific_demands_id_input" "uuid"[], "documents_id_input" "uuid"[], "travels_id_input" "uuid"[], "referrals_input" "jsonb"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_new_appointment"("date_input" "date", "time_input" time without time zone, "access_id_input" "uuid", "facility_id_input" "uuid", "modality_id_input" "uuid", "protocol_input" "text", "service_id_input" "uuid", "psychological_assessment_id_input" "uuid", "social_assessment_id_input" "uuid", "general_demand_id_input" "uuid", "procedure_id_input" "uuid", "has_leave_of_absence_input" boolean, "record_progress_input" "text", "registered_by_input" "uuid", "specialists_id_input" "uuid"[], "attendeds_id_input" "uuid"[], "specific_demands_id_input" "uuid"[], "documents_id_input" "uuid"[], "travels_id_input" "uuid"[], "referrals_input" "jsonb"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."create_new_attended"("fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "policy_holder_id_input" "uuid", "is_civil_volunteer_input" boolean, "familiar_bond_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_new_attended"("fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "policy_holder_id_input" "uuid", "is_civil_volunteer_input" boolean, "familiar_bond_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_new_attended"("fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "policy_holder_id_input" "uuid", "is_civil_volunteer_input" boolean, "familiar_bond_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "email_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "email_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "email_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "cpf_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "password_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "password_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_new_user"("avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "password_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."create_new_user"("user_id_input" "uuid", "avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."create_new_user"("user_id_input" "uuid", "avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_new_user"("user_id_input" "uuid", "avatar_input" "text", "fullname_input" "text", "nickname_input" "text", "rg_input" "text", "rank_id_input" "uuid", "cadre_id_input" "uuid", "opm_id_input" "uuid", "gender_id_input" "uuid", "email_input" "text", "cpf_input" "text", "professional_registration_input" "text", "birth_date_input" "date", "marital_status_id_input" "uuid", "work_status_id_input" "uuid", "registered_by_input" "uuid", "zip_code_input" "text", "number_input" "text", "street_input" "text", "neighborhood_input" "text", "city_id_input" "uuid", "phones_input" "jsonb"[]) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_attended_appointments"("cpf_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_attended_appointments"("cpf_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_attended_appointments"("cpf_input" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_attended_appointments"("cpf_input" "text", "q_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_attended_appointments"("cpf_input" "text", "q_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_attended_appointments"("cpf_input" "text", "q_input" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_attended_appointments_by_query"("cpf_input" "text", "q_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_attended_appointments_by_query"("cpf_input" "text", "q_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_attended_appointments_by_query"("cpf_input" "text", "q_input" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_attended_profile"("cpf_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_attended_profile"("cpf_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_attended_profile"("cpf_input" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_attendeds_by_query"("q_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_attendeds_by_query"("q_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_attendeds_by_query"("q_input" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_specialists_by_query"("q_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_specialists_by_query"("q_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_specialists_by_query"("q_input" "text") TO "service_role";

GRANT ALL ON TABLE "public"."tb_accesses" TO "anon";
GRANT ALL ON TABLE "public"."tb_accesses" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_accesses" TO "service_role";

GRANT ALL ON TABLE "public"."tb_documents" TO "anon";
GRANT ALL ON TABLE "public"."tb_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_documents" TO "service_role";

GRANT ALL ON TABLE "public"."tb_general_demands" TO "anon";
GRANT ALL ON TABLE "public"."tb_general_demands" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_general_demands" TO "service_role";

GRANT ALL ON TABLE "public"."tb_modalities" TO "anon";
GRANT ALL ON TABLE "public"."tb_modalities" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_modalities" TO "service_role";

GRANT ALL ON TABLE "public"."tb_opms" TO "anon";
GRANT ALL ON TABLE "public"."tb_opms" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_opms" TO "service_role";

GRANT ALL ON TABLE "public"."tb_procedures" TO "anon";
GRANT ALL ON TABLE "public"."tb_procedures" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_procedures" TO "service_role";

GRANT ALL ON TABLE "public"."tb_psychological_assessments" TO "anon";
GRANT ALL ON TABLE "public"."tb_psychological_assessments" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_psychological_assessments" TO "service_role";

GRANT ALL ON TABLE "public"."tb_referral_destinations" TO "anon";
GRANT ALL ON TABLE "public"."tb_referral_destinations" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_referral_destinations" TO "service_role";

GRANT ALL ON TABLE "public"."tb_referral_types" TO "anon";
GRANT ALL ON TABLE "public"."tb_referral_types" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_referral_types" TO "service_role";

GRANT ALL ON TABLE "public"."tb_services" TO "anon";
GRANT ALL ON TABLE "public"."tb_services" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_services" TO "service_role";

GRANT ALL ON TABLE "public"."tb_social_assessments" TO "anon";
GRANT ALL ON TABLE "public"."tb_social_assessments" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_social_assessments" TO "service_role";

GRANT ALL ON TABLE "public"."tb_specific_demands" TO "anon";
GRANT ALL ON TABLE "public"."tb_specific_demands" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_specific_demands" TO "service_role";

GRANT ALL ON TABLE "public"."tb_travels" TO "anon";
GRANT ALL ON TABLE "public"."tb_travels" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_travels" TO "service_role";

GRANT ALL ON TABLE "public"."appointmentformdata" TO "anon";
GRANT ALL ON TABLE "public"."appointmentformdata" TO "authenticated";
GRANT ALL ON TABLE "public"."appointmentformdata" TO "service_role";

GRANT ALL ON TABLE "public"."tb_cadres" TO "anon";
GRANT ALL ON TABLE "public"."tb_cadres" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_cadres" TO "service_role";

GRANT ALL ON TABLE "public"."tb_familiar_bonds" TO "anon";
GRANT ALL ON TABLE "public"."tb_familiar_bonds" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_familiar_bonds" TO "service_role";

GRANT ALL ON TABLE "public"."tb_genders" TO "anon";
GRANT ALL ON TABLE "public"."tb_genders" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_genders" TO "service_role";

GRANT ALL ON TABLE "public"."tb_marital_status" TO "anon";
GRANT ALL ON TABLE "public"."tb_marital_status" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_marital_status" TO "service_role";

GRANT ALL ON TABLE "public"."tb_ranks" TO "anon";
GRANT ALL ON TABLE "public"."tb_ranks" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_ranks" TO "service_role";

GRANT ALL ON TABLE "public"."tb_work_status" TO "anon";
GRANT ALL ON TABLE "public"."tb_work_status" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_work_status" TO "service_role";

GRANT ALL ON TABLE "public"."clientformdata" TO "anon";
GRANT ALL ON TABLE "public"."clientformdata" TO "authenticated";
GRANT ALL ON TABLE "public"."clientformdata" TO "service_role";

GRANT ALL ON TABLE "public"."tb_addresses" TO "anon";
GRANT ALL ON TABLE "public"."tb_addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_addresses" TO "service_role";

GRANT ALL ON TABLE "public"."tb_appointment_referrals" TO "anon";
GRANT ALL ON TABLE "public"."tb_appointment_referrals" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_appointment_referrals" TO "service_role";

GRANT ALL ON TABLE "public"."tb_appointments" TO "anon";
GRANT ALL ON TABLE "public"."tb_appointments" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_appointments" TO "service_role";

GRANT ALL ON TABLE "public"."tb_appointments_attendeds" TO "anon";
GRANT ALL ON TABLE "public"."tb_appointments_attendeds" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_appointments_attendeds" TO "service_role";

GRANT ALL ON TABLE "public"."tb_appointments_documents" TO "anon";
GRANT ALL ON TABLE "public"."tb_appointments_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_appointments_documents" TO "service_role";

GRANT ALL ON TABLE "public"."tb_appointments_specialists" TO "anon";
GRANT ALL ON TABLE "public"."tb_appointments_specialists" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_appointments_specialists" TO "service_role";

GRANT ALL ON TABLE "public"."tb_appointments_specific_demands" TO "anon";
GRANT ALL ON TABLE "public"."tb_appointments_specific_demands" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_appointments_specific_demands" TO "service_role";

GRANT ALL ON TABLE "public"."tb_appointments_travels" TO "anon";
GRANT ALL ON TABLE "public"."tb_appointments_travels" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_appointments_travels" TO "service_role";

GRANT ALL ON TABLE "public"."tb_attendeds" TO "anon";
GRANT ALL ON TABLE "public"."tb_attendeds" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_attendeds" TO "service_role";

GRANT ALL ON TABLE "public"."tb_cities" TO "anon";
GRANT ALL ON TABLE "public"."tb_cities" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_cities" TO "service_role";

GRANT ALL ON TABLE "public"."tb_cmds" TO "anon";
GRANT ALL ON TABLE "public"."tb_cmds" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_cmds" TO "service_role";

GRANT ALL ON TABLE "public"."tb_phones" TO "anon";
GRANT ALL ON TABLE "public"."tb_phones" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_phones" TO "service_role";

GRANT ALL ON TABLE "public"."tb_states" TO "anon";
GRANT ALL ON TABLE "public"."tb_states" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_states" TO "service_role";

GRANT ALL ON TABLE "public"."tb_users" TO "anon";
GRANT ALL ON TABLE "public"."tb_users" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_users" TO "service_role";

GRANT ALL ON TABLE "public"."tb_users_addresses" TO "anon";
GRANT ALL ON TABLE "public"."tb_users_addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_users_addresses" TO "service_role";

GRANT ALL ON TABLE "public"."tb_users_phones" TO "anon";
GRANT ALL ON TABLE "public"."tb_users_phones" TO "authenticated";
GRANT ALL ON TABLE "public"."tb_users_phones" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
