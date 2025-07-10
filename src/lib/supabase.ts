import { createClient } from '@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE')!

export const supabase = createClient(supabaseUrl, supabaseKey)
export const adminSupabase = createClient(supabaseUrl, supabaseServiceRole)
