Switch stats to admin client
In src/app/api/admin/stats/route.ts
replace import { supabase } from '@/lib/supabase' with import { supabaseAdmin } from '@/lib/supabase', and change all calls in that file to use supabaseAdmin.
This will bypass RLS for the admin-only endpoint and return real counts and recent orders.