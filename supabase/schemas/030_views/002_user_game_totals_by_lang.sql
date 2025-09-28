CREATE OR REPLACE VIEW "public"."user_game_totals_by_lang" AS
 SELECT "ug"."user_id",
    "u"."name" AS "user_name",
    "ug"."lang",
    "count"(*) AS "games_count",
    "sum"("ug"."punctuation") AS "total_points",
    "avg"("ug"."time") AS "avg_time",
    "min"("ug"."created_at") AS "first_game_at",
    "max"("ug"."created_at") AS "last_game_at"
   FROM ("public"."unique_games" "ug"
     JOIN "public"."users" "u" ON (("u"."id" = "ug"."user_id")))
  GROUP BY "ug"."user_id", "u"."name", "ug"."lang";

ALTER VIEW "public"."user_game_totals_by_lang" OWNER TO "postgres";

GRANT ALL ON TABLE "public"."user_game_totals_by_lang" TO "anon";
GRANT ALL ON TABLE "public"."user_game_totals_by_lang" TO "authenticated";
GRANT ALL ON TABLE "public"."user_game_totals_by_lang" TO "service_role";
