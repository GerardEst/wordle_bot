CREATE POLICY "Enable read access for all users" ON "public"."games_chats" FOR SELECT USING (true);
CREATE POLICY "Enable write access for all users" ON "public"."games_chats" FOR INSERT WITH CHECK (true);

ALTER TABLE "public"."games_chats" ENABLE ROW LEVEL SECURITY;
