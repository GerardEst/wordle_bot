CREATE POLICY "Enable insert for all users" ON "public"."front_logs" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable write access for all users" ON "public"."front_logs" FOR INSERT WITH CHECK (true);

ALTER TABLE "public"."front_logs" ENABLE ROW LEVEL SECURITY;
