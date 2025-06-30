import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Deno.env.get('https://ukqqfmdesasqtdkxdzgw.supabase.co')!
const supabaseKey = Deno.env.get(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrcXFmbWRlc2FzcXRka3hkemd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTk4MjgsImV4cCI6MjA2Njg3NTgyOH0.JzFBPJY6fiUF-vjK8FkyjhYghqdT5ovCx6Rm5scolTg'
)!

export const supabase = createClient(supabaseUrl, supabaseKey)
