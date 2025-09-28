CREATE POLICY "Everyone can add logs" ON "public"."bot_logs" FOR INSERT WITH CHECK (true);

ALTER TABLE "public"."bot_logs" ENABLE ROW LEVEL SECURITY;
