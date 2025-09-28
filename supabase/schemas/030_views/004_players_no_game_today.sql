CREATE OR REPLACE VIEW "public"."players_no_game_today" WITH ("security_invoker"='on') AS
 SELECT "id",
    "name",
    "created_at"
   FROM "public"."users" "u"
  WHERE ((EXISTS ( SELECT 1
           FROM "public"."games_chats" "gc"
          WHERE ("gc"."user_id" = "u"."id"))) AND (NOT (EXISTS ( SELECT 1
           FROM "public"."games_chats" "gc2"
          WHERE (("gc2"."user_id" = "u"."id") AND (("gc2"."created_at")::"date" = CURRENT_DATE))))));

ALTER VIEW "public"."players_no_game_today" OWNER TO "postgres";

GRANT ALL ON TABLE "public"."players_no_game_today" TO "anon";
GRANT ALL ON TABLE "public"."players_no_game_today" TO "authenticated";
GRANT ALL ON TABLE "public"."players_no_game_today" TO "service_role";
