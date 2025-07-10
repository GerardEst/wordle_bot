import { createClient } from '@supabase/supabase-js'

console.log('DEBUG: All env vars:', Object.keys(Deno.env.toObject()))
console.log('DEBUG: SUPABASE_URL:', Deno.env.get('SUPABASE_URL'))
console.log('DEBUG: SUPABASE_ANON_KEY:', Deno.env.get('SUPABASE_ANON_KEY'))
console.log('DEBUG: SUPABASE_SERVICE_ROLE:', Deno.env.get('SUPABASE_SERVICE_ROLE'))

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE')!

export const supabase = createClient(supabaseUrl, supabaseKey)
export const adminSupabase = createClient(supabaseUrl, supabaseServiceRole)
