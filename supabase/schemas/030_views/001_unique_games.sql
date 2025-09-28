CREATE OR REPLACE VIEW "public"."unique_games" AS
 SELECT ("array_agg"("gc"."id" ORDER BY "gc"."created_at" DESC))[1] AS "id",
    "gc"."user_id",
    "u"."name" AS "user_name",
    "gc"."lang",
    ("array_agg"("gc"."punctuation" ORDER BY "gc"."created_at" DESC))[1] AS "punctuation",
    ("array_agg"("gc"."time" ORDER BY "gc"."created_at" DESC))[1] AS "time",
    "max"("gc"."created_at") AS "created_at",
    (("gc"."created_at" AT TIME ZONE 'Europe/Madrid'::"text"))::"date" AS "created_at_date",
    "array_agg"(DISTINCT "gc"."chat_id") AS "chats_id"
   FROM ("public"."games_chats" "gc"
     JOIN "public"."users" "u" ON (("u"."id" = "gc"."user_id")))
  WHERE ("gc"."character_id" IS NULL)
  GROUP BY "gc"."user_id", "u"."name", ((("gc"."created_at" AT TIME ZONE 'Europe/Madrid'::"text"))::"date"), "gc"."lang";

ALTER VIEW "public"."unique_games" OWNER TO "postgres";

GRANT ALL ON TABLE "public"."unique_games" TO "anon";
GRANT ALL ON TABLE "public"."unique_games" TO "authenticated";
GRANT ALL ON TABLE "public"."unique_games" TO "service_role";
