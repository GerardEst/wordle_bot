create or replace view "public"."user_game_totals_by_lang" as  SELECT ug.user_id,
    u.name AS user_name,
    ug.lang,
    count(*) AS games_count,
    sum(ug.punctuation) AS total_points,
    round(avg(ug."time")) AS avg_time,
    min(ug.created_at) AS first_game_at,
    max(ug.created_at) AS last_game_at,
    ( select array_agg(distinct chat_id)::bigint[] from ( select unnest(ug2.chats_id) as chat_id from public.unique_games ug2 where ug2.user_id = ug.user_id and ug2.lang = ug.lang ) s ) as chats_ids
   FROM (unique_games ug
     JOIN users u ON ((u.id = ug.user_id)))
  GROUP BY ug.user_id, u.name, ug.lang;
