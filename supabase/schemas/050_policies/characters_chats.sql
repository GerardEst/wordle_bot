CREATE POLICY "Enable delete for EVERYONE" ON "public"."characters_chats" FOR DELETE USING (true);
CREATE POLICY "Enable insert access for all users" ON "public"."characters_chats" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all users" ON "public"."characters_chats" FOR SELECT USING (true);

ALTER TABLE "public"."characters_chats" ENABLE ROW LEVEL SECURITY;
