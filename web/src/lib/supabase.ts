import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

/**
 * Lazy Supabase client — safe during SSR / Vercel build
 * (env vars are only available at runtime in the browser)
 */
function getClient(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

/**
 * Proxy that forwards every property access to the lazy client.
 * This lets existing code keep `import { supabase }` and call
 * `supabase.from(...)`, `supabase.auth.xxx` etc. without any
 * module-level crash during the Vercel build.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
