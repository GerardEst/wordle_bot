CREATE OR REPLACE FUNCTION "public"."get_unique_chat_ids"("lang_param" "text") RETURNS SETOF bigint
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
    SELECT DISTINCT gc.chat_id
    FROM games_chats gc
    WHERE gc.chat_id IS NOT NULL
      AND gc.lang = lang_param
    ORDER BY gc.chat_id;
END;
$$;

ALTER FUNCTION "public"."get_unique_chat_ids"("lang_param" "text") OWNER TO "postgres";

GRANT ALL ON FUNCTION "public"."get_unique_chat_ids"("lang_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_unique_chat_ids"("lang_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_unique_chat_ids"("lang_param" "text") TO "service_role";
