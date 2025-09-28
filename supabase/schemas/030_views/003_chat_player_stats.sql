CREATE OR REPLACE VIEW "public"."chat_player_stats" WITH ("security_invoker"='on') AS
 WITH "player_chat_details" AS (
         SELECT "games_chats"."chat_id",
            "games_chats"."user_id",
            "u"."name" AS "username",
            "min"("games_chats"."created_at") AS "first_message",
            "max"("games_chats"."created_at") AS "last_message",
            "count"("games_chats"."id") AS "message_count"
           FROM ("public"."games_chats"
             LEFT JOIN "public"."users" "u" ON (("games_chats"."user_id" = "u"."id")))
          WHERE ("games_chats"."chat_id" IS NOT NULL)
          GROUP BY "games_chats"."chat_id", "games_chats"."user_id", "u"."name"
        ), "chat_stats" AS (
         SELECT "player_chat_details"."chat_id",
            "count"(DISTINCT "player_chat_details"."user_id") AS "total_players",
            "count"(DISTINCT
                CASE
                    WHEN (("player_chat_details"."last_message")::"date" = CURRENT_DATE) THEN "player_chat_details"."user_id"
                    ELSE NULL::bigint
                END) AS "players_today",
            "min"("player_chat_details"."first_message") AS "first_chat_date",
            "max"("player_chat_details"."last_message") AS "last_chat_date",
            "jsonb_agg"("jsonb_build_object"('user_id', "player_chat_details"."user_id", 'username', "player_chat_details"."username", 'first_message', "player_chat_details"."first_message", 'last_message', "player_chat_details"."last_message", 'message_count', "player_chat_details"."message_count", 'active_today', (("player_chat_details"."last_message")::"date" = CURRENT_DATE)) ORDER BY "player_chat_details"."user_id") AS "chat_members"
           FROM "player_chat_details"
          GROUP BY "player_chat_details"."chat_id"
        )
 SELECT "chat_id",
    "total_players",
    "players_today",
    "round"((((COALESCE("players_today", (0)::bigint))::numeric * 100.0) / (NULLIF("total_players", 0))::numeric), 2) AS "today_percentage",
    "first_chat_date",
    "last_chat_date",
    "age"("last_chat_date", "first_chat_date") AS "chat_duration",
    "chat_members"
   FROM "chat_stats"
  ORDER BY "total_players" DESC;

ALTER VIEW "public"."chat_player_stats" OWNER TO "postgres";

GRANT ALL ON TABLE "public"."chat_player_stats" TO "anon";
GRANT ALL ON TABLE "public"."chat_player_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_player_stats" TO "service_role";
