CREATE POLICY "Enable insert for all users" ON "public"."users" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
