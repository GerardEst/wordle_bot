CREATE POLICY "Enable read access for all users" ON "public"."characters" FOR SELECT USING (true);

ALTER TABLE "public"."characters" ENABLE ROW LEVEL SECURITY;
