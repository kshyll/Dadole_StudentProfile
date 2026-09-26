const SUPABASE_URL = "https://ruzhlnfixjtpbxxwfgfg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_b0QK8FS9hSW3t19Jd17kWw_eHCRTP0i";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: false
        }
    }
);
